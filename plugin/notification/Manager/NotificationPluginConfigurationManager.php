<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 4/14/15
 */

namespace Icap\NotificationBundle\Manager;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Icap\NotificationBundle\Exception\InvalidNotificationFormException;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class NotificationPluginConfigurationManager.
 *
 * @DI\Service("icap.notification.manager.plugin_configuration")
 */
class NotificationPluginConfigurationManager
{
    /**
     * @var \Symfony\Component\Form\FormFactoryInterface
     */
    private $formFactory;

    private $ch;

    /**
     * @DI\InjectParams({
     *      "formFactory"   = @DI\Inject("form.factory"),
     *      "ch"            = @DI\Inject("claroline.config.platform_config_handler")
     * })
     */
    public function __construct(
        FormFactoryInterface $formFactory,
        PlatformConfigurationHandler $ch
    ) {
        $this->formFactory = $formFactory;
        $this->ch = $ch;
    }

    /**
     * @return \Symfony\Component\Form\FormInterface
     */
    public function getForm()
    {
        $config = $this->ch->getPlatformConfig();

        $form = $this->formFactory->create(
            'icap_notification_type_pluginConfiguration',
            $config
        );

        return $form;
    }

    public function processForm(Request $request)
    {
        $form = $this->getForm();
        $form->handleRequest($request);

        if ($form->isValid()) {
            $this->ch->setPlatformConfig($form->getData());

            return $form;
        }

        throw new InvalidNotificationFormException('invalid_parameters', $form);
    }
}
