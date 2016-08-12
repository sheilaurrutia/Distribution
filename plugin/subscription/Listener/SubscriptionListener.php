<?php

namespace Claroline\SubscriptionBundle\Listener;

use Claroline\CoreBundle\Entity\Resource\File;
use Claroline\CoreBundle\Event\CopyResourceEvent;
use Claroline\CoreBundle\Event\CreateFormResourceEvent;
use Claroline\CoreBundle\Event\CreateResourceEvent;
use Claroline\CoreBundle\Event\DeleteResourceEvent;
use Claroline\CoreBundle\Event\DownloadResourceEvent;
use Claroline\CoreBundle\Event\OpenResourceEvent;
use Claroline\CoreBundle\Form\FileType;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @DI\Service("claroline.listener.subscription_listener")
 */
class SubscriptionListener
{
    /**
     * Service container
     */
    private $container;

    public function __construct(ContainerInterface $container) {
        $this->container = $container;
    }

    /**
     * @DI\Observe("create_form_claroline_subscription")
     *
     * @param CreateFormResourceEvent $event
     */
    public function onCreateForm(CreateFormResourceEvent $event) {
        $form = $this->container->get('form.factory')->create(new FileType, new File());
        $content = $this->container->get('templating')->render(
            'ClarolineCoreBundle:Resource:createForm.html.twig',
            array(
                'form' => $form->createView(),
                'resourceType' => 'claroline_subscription'
            )
        );
        $event->setResponseContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("create_claroline_subscription")
     *
     * @param CreateResourceEvent $event
     */
    public function onCreate(CreateResourceEvent $event) {
        $request = $this->container->get('request');
        $form = $this->container->get('form.factory')->create();
        $form->handleRequest($request);

        if($form->isValid()) {
            //TODO complete the table 'SubscriptionCreation'
            $event->stopPropagation();
            return;
        }
        $content = $this->container->get('templating')->render(
            'ClarolineCoreBundle:Resource:createForm.html.twig',
            array(
                'form' => $form->createView(),
                'resourceType' => $event->getResourceType(),
            )
        );

        $event->setErrorFormContent($content);
        $event->stopPropagation();
    }

    /**
     * @param DeleteResourceEvent $event
     */
    public function onDelete(DeleteResourceEvent $event) {

    }

    /**
     * @DI\Observe("copy_claroline_subscription")
     *
     * @param CopyResourceEvent $event
     */
    public function onCopy(CopyResourceEvent $event) {

    }

    /**
     * @DI\Observe("download_claroline_subscription")
     *
     * @param DownloadResourceEvent $event
     */
    public function onDownload(DownloadResourceEvent $event) {

    }

    /**
     * @DI\Observe("open_claroline_subscription")
     *
     * @param OpenResourceEvent $event
     */
    public function onOpenSubscription(OpenResourceEvent $event) {

    }
}