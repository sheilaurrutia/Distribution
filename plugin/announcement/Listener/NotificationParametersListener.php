<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 */

namespace Claroline\AnnouncementBundle\Listener;

use Claroline\CoreBundle\Event\Notification\NotificationParametersEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 */
class NotificationParametersListener
{
    /**
     * @param NotificationParametersEvent $event
     *
     * @DI\Observe("icap_notification_parameters_event")
     */
    public function onGetTypesForParameters(NotificationParametersEvent $event)
    {
        $event->addTypes('claroline_announcement_aggregate', false, 'claroline_announcement_aggregate');
    }
}
