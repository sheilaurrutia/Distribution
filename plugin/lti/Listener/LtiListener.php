<?php

namespace UJM\LtiBundle\Listener;

use Claroline\CoreBundle\Event\CreateFormResourceEvent;
use Claroline\CoreBundle\Event\CreateResourceEvent;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use Claroline\CoreBundle\Event\OpenAdministrationToolEvent;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\DiExtraBundle\Annotation\Inject;
use JMS\DiExtraBundle\Annotation\InjectParams;
use JMS\DiExtraBundle\Annotation\Observe;
use JMS\DiExtraBundle\Annotation\Service;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use UJM\LtiBundle\Form\AppResourceType;

/**
 * @Service()
 */
class LtiListener
{
    private $request;
    private $httpKernel;
    private $container;

    /**
     * @InjectParams({
     *     "request"    = @Inject("request_stack"),
     *     "httpKernel" = @Inject("http_kernel"),
     *     "container" = @DI\Inject("service_container")
     * })
     */
    public function __construct(RequestStack $request, HttpKernelInterface $httpKernel, ContainerInterface $container)
    {
        $this->request = $request->getMasterRequest();
        $this->httpKernel = $httpKernel;
        $this->container = $container;
    }

    /**
     * @Observe("administration_tool_LTI")
     *
     * @param GetResponseEvent $event
     */
    public function onKernelRequest(OpenAdministrationToolEvent $event)
    {
        $params = [];
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
        $params = [];
        $params['_controller'] = 'UJMLtiBundle:LtiWs:tool_apps';
        $params['workspace'] = $event->getWorkspace();
        $subRequest = $this->request->duplicate([], null, $params);
        $response = $this->httpKernel
            ->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
        $event->setContent($response->getContent());
        $event->stopPropagation();
    }

    private function redirect($params, $event)
    {
        $subRequest = $this->request->duplicate([], null, $params);
        $response = $this->httpKernel->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
        $event->setResponse($response);
        $event->stopPropagation();
    }

    /**
     * Displays a form to create an LTI link.
     *
     * @DI\Observe("create_form_ujm_lti_resource")
     *
     * @param CreateFormResourceEvent $event
     */
    public function onCreateForm(CreateFormResourceEvent $event)
    {
        /** @var FormInterface $form */
        $form = $this->container->get('form.factory')->create(new AppResourceType());

        $content = $this->container->get('templating')->render(
            'ClarolineCoreBundle:Resource:createForm.html.twig', [
                'resourceType' => 'ujm_lti',
                'form' => $form->createView(),
            ]
        );

        $event->setResponseContent($content);
        $event->stopPropagation();
    }

    /**
     * Creates a new link LTI app.
     *
     * @DI\Observe("create_ujm_lti_resource")
     *
     * @param CreateResourceEvent $event
     */
    public function onCreate(CreateResourceEvent $event)
    {
        /** @var FormInterface $form */
        $form = $this->container->get('form.factory')->create(new AppResourceType());
        $request = $this->container->get('request');

        $form->handleRequest($request);
        if ($form->isValid()) {
            $em = $this->container->get('doctrine.orm.entity_manager');
        } else {
            $content = $this->container->get('templating')->render(
                'ClarolineCoreBundle:Resource:createForm.html.twig', [
                    'resourceType' => 'ujm_lti',
                    'form' => $form->createView(),
                ]
            );

            $event->setErrorFormContent($content);
        }

        $event->stopPropagation();
    }
}
