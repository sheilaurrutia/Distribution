<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 4/13/15
 */

namespace Claroline\CoreBundle\Listener\Notification;

use Claroline\CoreBundle\Event\Notification\NotificationParametersEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class NotificationParametersListener.
 *
 * @DI\Service()
 */
class NotificationParametersListener
{
    /**
     * @param NotificationParametersEvent $event
     *
     * @DI\Observe("icap_notification_user_parameters_event")
     */
    public function onGetTypesForParameters(NotificationParametersEvent $event)
    {
        $event->addTypes('role-change_right', false, 'role-change_right');
        $event->addTypes('badge-award', false, 'badge-award');
        $event->addTypes('role-subscribe', false, 'role-subscribe');
        $event->addTypes('resource-text', false, 'resource-text');
    }
}
