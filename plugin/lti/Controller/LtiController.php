<?php

namespace UJM\LtiBundle\Controller;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
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
            $ltiParams = $this->getLtiData($workspace, $app);
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

    private function getLtiData($ws, $app)
    {
        $user = $this->container->get('security.context')->getToken()->getUser();
        $isWorkspaceManager = $this->isWorkspaceManager($ws, $user);
        if ($isWorkspaceManager === true) {
            $role = 'Instructor';
        } else {
            $role = 'Learner';
        }
        $now = new \DateTime();

        $ltiData = array(
            'user_id' => $user->getUsername(),
            'roles' => $role,
            'resource_link_id' => $ws->getId(),
            'resource_link_title' => 'LTI APP',
            'resource_link_description' => $app->getDescription(),
            'lis_person_name_full' => $user->getFirstname().' '.$user->getLastname(),
            'launch_presentation_locale' => 'fr-FR',
        );
        $ltiData['lti_version'] = 'LTI-2p0';
        $ltiData['lti_message_type'] = 'basic-lti-launch-request';

        //Basic LTI uses OAuth to sign requests
        //OAuth Core 1.0 spec: http://oauth.net/core/1.0/

        $ltiData['oauth_callback'] = 'about:blank';
        $ltiData['oauth_consumer_key'] = $app->getAppkey();
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

    private function isWorkspaceManager(Workspace $workspace, User $user)
    {
        $isWorkspaceManager = false;
        $managerRole = 'ROLE_WS_MANAGER_'.$workspace->getGuid();
        $roleNames = $user->getRoles();

        if (in_array('ROLE_ADMIN', $roleNames) || in_array($managerRole, $roleNames)) {
            $isWorkspaceManager = true;
        }

        return $isWorkspaceManager;
    }
}
