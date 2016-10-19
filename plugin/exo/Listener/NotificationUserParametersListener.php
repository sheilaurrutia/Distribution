<?php

/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 *
 */

namespace UJM\ExoBundle\Listener;

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
         $children = array(
            'create_exercises',
            'correction_requested',
            'correction_available',
            'deletion_exercises'
        );
        $event->addTypes('ujm_exercise','ujm_exercise',false,$children);
       
    }
}