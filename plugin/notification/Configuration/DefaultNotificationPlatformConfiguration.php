<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Icap\NotificationBundle\Configuration;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationParametersInterface;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.configuration")
 */
class DefaultNotificationPlatformConfiguration implements PlatformConfigurationParametersInterface
{
    public function getDefaultParameters()
    {
        return [
            'is_notification_active' => true,
            'notification_dropdown_items' => 10,
            'notification_max_per_page' => 50,
            'notification_purge_enabled' => true,
            'notification_purge_after_days' => 60,
            'notification_last_purge_date' => (new \DateTime())->setTime(0, 0, 0),
            'notification_allow_phone_and_mail' => false,
            'notification_display_enabled_types' => [],
            'notification_phone_enabled_types' => [],
            'notification_mail_enabled_types' => [],
            'notification_rss_enabled_types' => [],
            'notification_locked_display_enabled_types' => [],
            'notification_locked_phone_enabled_types' => [],
            'notification_locked_mail_enabled_types' => [],
            'notification_locked_rss_enabled_types' => [],
        ];
    }
}
