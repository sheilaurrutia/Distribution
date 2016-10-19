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

use Claroline\CoreBundle\Event\Notification\NotificationUserParametersEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class NotificationUserParametersListener.
 *
 * @DI\Service()
 */
class NotificationUserParametersListener
{
    /**
     * @param NotificationUserParametersEvent $event
     *
     * @DI\Observe("icap_notification_user_parameters_event")
     */
    public function onGetTypesForParameters(NotificationUserParametersEvent $event)
    {
        $event->addTypes('role-change_right', 'role-change_right');
        $event->addTypes('badge-award', 'badge-award');
        $event->addTypes('role-subscribe', 'role-subscribe');
        $event->addTypes('resource-text', 'resource-text');
    }
}
