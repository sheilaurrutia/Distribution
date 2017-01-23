<?php

namespace UJM\LtiBundle\Controller;

use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use UJM\LtiBundle\Entity\LtiApp;
use UJM\LtiBundle\Form\AppType;

/**
 * @DI\Tag("security.secure_service")
 * @SEC\PreAuthorize("canOpenAdminTool('administration_tool_lti')")
 */
class LtiController extends Controller
{
    /*private $httpKernel;
    private $request;

    /**
     * @DI\InjectParams({
     *     "httpKernel"      = @DI\Inject("http_kernel"),
     *     "requestStack"    = @DI\Inject("request_stack")
     * })
     */
    /*public function __construct(HttpKernelInterface $httpKernel, RequestStack $requestStack)
    {
        $this->httpKernel = $httpKernel;
        $this->request = $requestStack->getCurrentRequest();
    }*/

    /**
     * @Route("/apps", name="ujm_admin_lti")
     * @Template
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function appAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = new LtiApp();
        $form = $this->createForm(new AppType(), $entity);
        $vars['form'] = $form->createView();

        if ($request->isMethod('POST')) {
            $form->handleRequest($request);
            if ($form->isValid()) {
                $em->persist($entity);
                $em->flush();
            }
        }
        $vars['apps'] = $this->getAllApps();

        return $this->render('UJMLtiBundle:Lti:app.html.twig', $vars);
    }

    /**
     * @Route("/delete/app/{appId}", name="ujm_lti_delete_app")
     *
     * @param int appId
     * @Template
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function deleteAction($appId)
    {
        $em = $this->getDoctrine()->getManager();
        $app = $em->getRepository('UJMLtiBundle:LtiApp')->find($appId);
        $em->remove($app);
        $em->flush();

        return $this->forward('UJMLtiBundle:Lti:app');
    }

    /**
     * @Route("/tool_apps/{workspace}", name="ujm_lti_tool_apps")
     *
     * @Template
     *
     * @param Workspace $workspace
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tool_appsAction(Workspace $workspace)
    {
        $vars['workspace'] = $workspace;
        $vars['apps'] = $this->getAllApps();
        foreach ($vars['apps'] as $app) {
            $ltiParams = $this->getLtiData($workspace->getId(), $app);
            $vars['ltiDatas']['app_'.$app->getId()] = $ltiParams['ltiData'];
            $vars['signature']['app_'.$app->getId()] = $ltiParams['signature'];
        }

        return $this->render('UJMLtiBundle:Lti:tool_apps.html.twig', $vars);
    }

    private function getAllApps()
    {
        $em = $this->getDoctrine()->getManager();
        $apps = $em->getRepository('UJMLtiBundle:LtiApp')->findAll();

        return $apps;
    }

    private function getLtiData($wsid, $app)
    {
        $now = new \DateTime();

        $ltiData = array(
            'user_id' => 'David',
            'roles' => 'Instructor',
            'resource_link_id' => "$wsid",
            'resource_link_title' => 'Test LTI APP',
            'resource_link_description' => 'A weekly blog.',
            'lis_person_name_full' => 'David UJM',
            'lis_person_name_family' => 'Public',
            'lis_person_name_given' => 'Given',
            'lis_person_contact_email_primary' => 'user@school.edu',
            'lis_person_sourcedid' => 'school.edu:user',
            'context_id' => '456434513',
            'context_title' => 'Design of Personal Environments',
            'context_label' => 'SI182',
            'tool_consumer_instance_guid' => 'lmsng.school.edu',
            'tool_consumer_instance_description' => 'University of School (LMSng)',
            'launch_presentation_locale' => 'fr-FR',
        );
        $ltiData['lti_version'] = 'LTI-2p0';
        $ltiData['lti_message_type'] = 'basic-lti-launch-request';

        //Basic LTI uses OAuth to sign requests
        //OAuth Core 1.0 spec: http://oauth.net/core/1.0/

        $ltiData['oauth_callback'] = 'about:blank';
        $ltiData['oauth_consumer_key'] = $app->getKey();
        $ltiData['oauth_version'] = '1.0';
        $ltiData['oauth_nonce'] = uniqid('', true);
        $ltiData['oauth_timestamp'] = $now->getTimestamp();
        $ltiData['oauth_signature_method'] = 'HMAC-SHA1';

        //In OAuth, request parameters must be sorted by name
        $launch_data_keys = array_keys($ltiData);
        sort($launch_data_keys);

        $launch_params = array();
        foreach ($launch_data_keys as $key) {
            array_push($launch_params, $key.'='.rawurlencode($ltiData[$key]));
        }

        $base_string = 'POST&'.urlencode($app->getUrl()).'&'.rawurlencode(implode('&', $launch_params));
        $secret = urlencode($app->getSecret()).'&';
        $signature = base64_encode(hash_hmac('sha1', $base_string, $secret, true));

        $ltiParams['ltiData'] = $ltiData;
        $ltiParams['signature'] = $signature;

        return $ltiParams;
    }
}
