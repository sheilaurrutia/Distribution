<?php

/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 */

namespace UJM\ExoBundle\Listener;

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
        $children = [
            'create_exercises',
            'correction_requested',
            'correction_available',
            'deletion_exercises',
        ];
        $event->addTypes('ujm_exercise', false, 'ujm_exercise', $children);
        $event->addTypes($children, true, 'ujm_exercise');
    }
}
