<?php

namespace Icap\BibliographyBundle\Controller;

use Claroline\CoreBundle\Entity\Workspace\Workspace;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Request\ParamFetcher;
use Icap\BibliographyBundle\Exception\CurlException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @NamePrefix("icap_bibliography_api_")
 */
class ApiController extends FOSRestController
{
    /**
     * Search in ISBNDB.
     *
     * @param Workspace    $workspace
     * @param ParamFetcher $paramFetcher
     *
     * @Get("{workspace}/books/search", name="book_search", options = { "expose" = true })
     *
     * @QueryParam(name="query", description="Searched query")
     * @QueryParam(name="index", description="Index of the database used to search for the query", default="title")
     * @QueryParam(name="page", description="Page of returned results", requirements="\d+", default="1")
     *
     * @return jsonResponse
     *
     * @throws HttpException
     * @throws \Exception
     */
    public function bookSearchAction(Workspace $workspace, ParamFetcher $paramFetcher)
    {
        $api_key = $this->getApiKey();

        //Todo: Check access rights

        // Prepare API URL, always ask for stats
        $query = $paramFetcher->get('query');
        $index = $paramFetcher->get('index');
        $page = $paramFetcher->get('page');
        $url = "http://isbndb.com/api/v2/json/$api_key/books?q=$query&i=$index&p=$page&opt=keystats";

        // Send request
        $result = $this->sendRequest($url);

        // Remove keyId if present
        unset($result['keystats']['key_id']);

        return $result;
    }

    /**
     * Get book details from ISBNDB.
     *
     * @param Workspace    $workspace
     * @param ParamFetcher $paramFetcher
     *
     * @Get("{workspace}/book/details", name="book_details", options = { "expose" = true })
     *
     * @QueryParam(name="bookId", description="ISBN, Title or ISBNDB Id of the book")
     */
    public function bookDetailsAction(Workspace $workspace, ParamFetcher $paramFetcher)
    {
        $api_key = $this->getApiKey();

        //Todo: Check access rights

        // Prepare API URL, always ask for stats
        $bookId = $paramFetcher->get('bookId');
        $url = "http://isbndb.com/api/v2/json/$api_key/book/$bookId?opt=keystats";

        // Send request
        $result = $this->sendRequest($url);

        // Remove keyId if present
        unset($result['keystats']['key_id']);

        return $result;
    }

    /**
     * @return mixed
     *
     * @throws \Exception
     */
    private function getApiKey()
    {
        $configRepository = $this->get('icap_bibliography.repository.book_reference_configuration');
        $config = $configRepository->findAll()[0];
        $api_key = $config->getApiKey();

        if (is_null($api_key)) {
            throw new \Exception('API not configured');
        }

        return $api_key;
    }

    private function sendRequest($url)
    {
        // Request
        try {
            $result = $this->curlRequest($url);
        } catch (NotFoundHttpException $e) {
            throw new HttpException(404, 'Unable to contact API');
        } catch (CurlException $e) {
            throw new HttpException(400, $e->getMessage());
        }

        return $result;
    }

    /**
     * @param $url
     *
     * @return mixed
     *
     * @throws CurlException
     * @throws NotFoundHttpException
     */
    private function curlRequest($url)
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_COOKIESESSION, true);
        $data = curl_exec($curl);
        $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($http_code !== 200) {
            // Gérer les cas d'erreur

            // Le serveur ne répond pas
            throw new NotFoundHttpException();
        }

        $result = json_decode($data, true);

        if (array_key_exists('error', $result)) {
            // Gérer les autres erreurs
            // La limite de requêtes a été atteinte
            throw new CurlException($result['error']);
        }

        return $result;
    }
}
