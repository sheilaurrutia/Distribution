<?php

namespace Icap\BibliographyBundle\Listener;

use Claroline\CoreBundle\Event\CreateFormResourceEvent;
use Claroline\CoreBundle\Event\CreateResourceEvent;
use Claroline\CoreBundle\Event\CustomActionResourceEvent;
use Claroline\CoreBundle\Event\DeleteResourceEvent;
use Claroline\CoreBundle\Event\OpenResourceEvent;
use Claroline\CoreBundle\Event\PluginOptionsEvent;
use Claroline\CoreBundle\Library\Security\Collection\ResourceCollection;
use Icap\BibliographyBundle\Entity\BookReference;
use Icap\BibliographyBundle\Form\BookReferenceType;
use Icap\BibliographyBundle\Manager\BookReferenceManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\HttpKernelInterface;

/**
 * @DI\Service()
 */
class BibliographyListener
{
    private $container;
    private $httpKernel;
    private $request;
    protected $manager;

    /**
     * @DI\InjectParams({
     *     "container"    = @DI\Inject("service_container"),
     *     "httpKernel"   = @DI\Inject("http_kernel"),
     *     "requestStack" = @DI\Inject("request_stack"),
     *     "manager"      = @DI\Inject("icap.bibliography.manager")
     * })
     */
    public function __construct(ContainerInterface $container, HttpKernelInterface $httpKernel, RequestStack $requestStack, BookReferenceManager $manager)
    {
        $this->container = $container;
        $this->httpKernel = $httpKernel;
        $this->request = $requestStack->getCurrentRequest();
        $this->manager = $manager;
    }

    /**
     * @DI\Observe("create_form_icap_bibliography")
     *
     * @param CreateFormResourceEvent $event
     */
    public function onCreateForm(CreateFormResourceEvent $event)
    {
        $form = $this->container->get('form.factory')->create(new BookReferenceType(), new BookReference());
        $content = $this->container->get('templating')->render(
            'IcapBibliographyBundle:BookReference:createForm.html.twig',
            [
                'form' => $form->createView(),
                'resourceType' => 'icap_bibliography',
            ]
        );
        $event->setResponseContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("create_icap_bibliography")
     *
     * @param CreateResourceEvent $event
     */
    public function onCreate(CreateResourceEvent $event)
    {
        $form = $this->container->get('form.factory')->create(new BookReferenceType(), new BookReference());
        $form->handleRequest($this->request);

        if ($form->isValid()) {
            $bookResource = $form->getData();
            $event->setResources([$bookResource]);
        } else {
            $content = $this->container->get('templating')->render(
                'ClarolineCoreBundle:Resource:createForm.html.twig',
                [
                    'form' => $form->createView(),
                    'resourceType' => 'icap_bibliography',
                ]
            );
            $event->setErrorFormContent($content);
        }
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_icap_bibliography")
     *
     * @param OpenResourceEvent $event
     */
    public function onOpen(OpenResourceEvent $event)
    {
        $bookReference = $event->getResource();
        $collection = new ResourceCollection([$bookReference->getResourceNode()]);
        $isGranted = $this->container->get('security.authorization_checker')->isGranted('EDIT', $collection);
        $content = $this->container->get('templating')->render(
            'IcapBibliographyBundle:BookReference:index.html.twig',
            [
                '_resource' => $bookReference,
                'isEditGranted' => $isGranted,
            ]
        );
        $response = new Response($content);
        $event->setResponse($response);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("delete_icap_bibliography")
     *
     * @param DeleteResourceEvent $event
     */
    public function onDelete(DeleteResourceEvent $event)
    {
        $em = $this->container->get('claroline.persistence.object_manager');
        $em->remove($event->getResource());
        $em->flush();
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("change_bookreference_menu_icap_bibliography")
     *
     * @param CustomActionResourceEvent $event
     */
    public function onChangeAction(CustomActionResourceEvent $event)
    {
        $resource = get_class($event->getResource()) === 'Claroline\CoreBundle\Entity\Resource\ResourceShortcut' ?
            $this->manager->getResourceFromShortcut($event->getResource()->getResourceNode()) :
            $event->getResource();
        $resource->setName($event->getResource()->getResourceNode()->getName());
        $form = $this->container->get('form.factory')->create(new BookReferenceType(), $resource);
        $form->handleRequest($this->request);

        $content = $this->container->get('templating')->render('IcapBibliographyBundle:BookReference:editForm.html.twig', [
            'form' => $form->createView(),
            'node' => $resource->getResourceNode()->getId(),
        ]);

        $event->setResponse(new Response($content));
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("plugin_options_bibliographybundle")
     */
    public function onConfig(PluginOptionsEvent $event)
    {
        $params = [];
        $params['_controller'] = 'IcapBibliographyBundle:BookReference:pluginConfigureForm';
        $subRequest = $this->container->get('request')->duplicate([], null, $params);
        $response = $this->container->get('http_kernel')->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
        $event->setResponse($response);
        $event->stopPropagation();
    }
}
