<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 27/07/16
 * Time: 14:41
 */

namespace Icap\TagwordsBundle\TagwordsController;

//use Symfony\Bundle\FrameworkBundle\Controller\Controller as BaseController;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use UJM\ExoBundle\Entity\Response;


use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Validator\Exception\MissingOptionsException;
use JMS\DiExtraBundle\Annotation as DI;



class TagwordsController extends BaseController
{



    /**
     * @Route("/tagwords", name="icap_tagwords_index")
     *
     * @return Response
     */
    public function indexAction()
    {
        print_r("aa");
        return new Response('hello Tagworld!');
        //throw new \Exception('hello');
    }/*

    /**
     * @Route("/tagwords", name="TagwordsBundle")
     * @Method({"GET"})
     **/
/*
    function listAction(){
        print_r("aaaaaah");
        ?>
<h1>azeazeazeaze</h1>

<?php

        return 0;
}

*/
}
/*
<?php

namespace ICAP\TagwordsBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

class TagwordsController extends Controller
{
    /**
     * @EXT\Route("/index", name="icap_tagwords_index")
     * @EXT\Template
     *
     * @return Response
     *//*
    public function indexAction()
    {
        throw new \Exception('hello');
    }
}*/