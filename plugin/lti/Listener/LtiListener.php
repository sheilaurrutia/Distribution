<?php

namespace UJM\LtiBundle\Listener;

use Claroline\CoreBundle\Event\OpenAdministrationToolEvent;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use JMS\DiExtraBundle\Annotation\Inject;
use JMS\DiExtraBundle\Annotation\InjectParams;
use JMS\DiExtraBundle\Annotation\Observe;
use JMS\DiExtraBundle\Annotation\Service;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\HttpKernelInterface;

/**
 * @Service()
 */
class LtiListener
{
    private $request;
    private $httpKernel;

    /**
     * @InjectParams({
     *     "request"    = @Inject("request_stack"),
     *     "httpKernel" = @Inject("http_kernel")
     * })
     */
    public function __construct(RequestStack $request, HttpKernelInterface $httpKernel)
    {
        $this->request = $request->getMasterRequest();
        $this->httpKernel = $httpKernel;
    }

    /**
     * @Observe("administration_tool_LTI")
     *
     * @param GetResponseEvent $event
     */
    public function onKernelRequest(OpenAdministrationToolEvent $event)
    {
        $params = array();
        $params['_controller'] = 'UJMLtiBundle:Lti:app';
        $this->redirect($params, $event);
    }

    /**
     * @Observe("open_tool_workspace_ujm_lti_tool_apps")
     *
     * @param DisplayToolEvent $event
     */
    public function onWorkspaceToolOpen(DisplayToolEvent $event)
    {
        $params = array();
        $params['_controller'] = 'UJMLtiBundle:LtiWs:tool_apps';
        $params['workspace'] = $event->getWorkspace();
        $subRequest = $this->request->duplicate(array(), null, $params);
        $response = $this->httpKernel
            ->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
        $event->setContent($response->getContent());
        $event->stopPropagation();
    }

    private function redirect($params, $event)
    {
        $subRequest = $this->request->duplicate(array(), null, $params);
        $response = $this->httpKernel->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
        $event->setResponse($response);
        $event->stopPropagation();
    }
}
