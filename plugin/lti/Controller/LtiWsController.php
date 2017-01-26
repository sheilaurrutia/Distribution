<?php

namespace UJM\LtiBundle\Controller;

use Claroline\CoreBundle\ClarolineCoreBundle;
use Claroline\CoreBundle\Entity\User;
use Proxies\__CG__\Claroline\CoreBundle\Entity\Workspace\Workspace;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\LtiBundle\Entity\LtiApp;

/**
 * @DI\Tag("security.secure_service")
 */
class LtiWsController extends Controller
{
    /**
     * @Route("/tool_apps/{workspace}", name="ujm_lti_tool_apps")
     *
     * @Template
     *
     * @param Workspace $workspace
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tool_appsAction(\Claroline\CoreBundle\Entity\Workspace\Workspace $workspace)
    {
        $user = $this->container->get('security.context')->getToken()->getUser();
        $isWorkspaceManager = $this->isWorkspaceManager($workspace, $user);
        $em = $this->getDoctrine()->getManager();
        $apps = $em->getRepository('UJMLtiBundle:LtiApp')->findAll();
        $vars['workspace'] = $workspace;
        $vars['workspaceManager'] = $isWorkspaceManager;
        $vars['apps'] = $apps;
        foreach ($vars['apps'] as $app) {
            $ltiParams = $this->getLtiData($workspace, $app);
            $vars['ltiDatas']['app_'.$app->getId()] = $ltiParams['ltiData'];
            $vars['signature']['app_'.$app->getId()] = $ltiParams['signature'];
            $vars['published']['app_'.$app->getId()] = $this->appAlreadyPublish($app->getId(), $workspace->getId());
        }

        return $this->render('UJMLtiBundle:Lti:tool_apps.html.twig', $vars);
    }

    /**
     * @Route("/tool_apps/publish/{wsId}/{appId}", name="ujm_lti_publish_app")
     *
     * @Template
     *
     * @param int wsId
     * @param int appId
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tool_publish_appAction($wsId, $appId)
    {
        $em = $this->getDoctrine()->getManager();
        $app = $em->getRepository('UJMLtiBundle:LtiApp')->find($appId);
        $ws = $em->getRepository('ClarolineCoreBundle:Workspace\Workspace')->find($wsId);
        $app->addWorkspace($ws);
        $em->persist($app);
        $em->flush();

        return $this->forward('UJMLtiBundle:LtiWs:tool_apps', array('workspace' => $ws));
    }

    /**
     * @Route("/tool_apps/unpublish/{wsId}/{appId}", name="ujm_lti_unpublish_app")
     *
     * @Template
     *
     * @param int wsId
     * @param int appId
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tool_unpublish_appAction($wsId, $appId)
    {
        $em = $this->getDoctrine()->getManager();
        $app = $em->getRepository('UJMLtiBundle:LtiApp')->find($appId);
        $ws = $em->getRepository('ClarolineCoreBundle:Workspace\Workspace')->find($wsId);

        $app->removeWorkspace($ws);
        $em->persist($app);
        $em->flush();

        return $this->forward('UJMLtiBundle:LtiWs:tool_apps', array('workspace' => $ws));
    }

    /**
     * @param Workspace $ws
     * @param LtiApp    $app
     *
     * @return mixed
     */
    private function getLtiData(\Claroline\CoreBundle\Entity\Workspace\Workspace $ws, LtiApp $app)
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

    /**
     * @param \Claroline\CoreBundle\Entity\Workspace\Workspace $workspace
     * @param User                                             $user
     *
     * @return bool
     */
    private function isWorkspaceManager(\Claroline\CoreBundle\Entity\Workspace\Workspace $workspace, User $user)
    {
        $isWorkspaceManager = false;
        $managerRole = 'ROLE_WS_MANAGER_'.$workspace->getGuid();
        $roleNames = $user->getRoles();

        if (in_array('ROLE_ADMIN', $roleNames) || in_array($managerRole, $roleNames)) {
            $isWorkspaceManager = true;
        }

        return $isWorkspaceManager;
    }

    /**
     * @param int $appId
     * @param int $wsId
     *
     * @return int
     */
    private function appAlreadyPublish($appId, $wsId)
    {
        $em = $this->getDoctrine()->getManager();
        $app = $em->getRepository('UJMLtiBundle:LtiApp')->appAlreadyPublish($appId, $wsId);

        return count($app);
    }
}
