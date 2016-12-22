<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 */

namespace Claroline\ForumBundle\Listener;

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
        $children = [
            'new_forum',
            'add_subject',
            'resource-claroline_forum-new_message',
            'deletion_forum',
        ];
        $event->addTypes('forum', false, 'forum', $children);
        $event->addTypes($children, true, 'forum');
    }
}
