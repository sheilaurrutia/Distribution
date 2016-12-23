<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 4/8/15
 */

namespace Icap\NotificationBundle\Manager;

use Claroline\CoreBundle\Event\Notification\NotificationParametersEvent;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Doctrine\ORM\NoResultException;
use Icap\NotificationBundle\Entity\NotificationParameters;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Class NotificationParametersManager.
 *
 * @DI\Service("icap.notification.manager.notification_parameters")
 */
class NotificationParametersManager
{
    /**
     * @var \Icap\NotificationBundle\Repository\NotificationParametersRepository
     */
    private $notificationParametersRepository;

    /**
     * @var \Symfony\Component\EventDispatcher\EventDispatcherInterface
     */
    private $ed;

    /**
     * @var \Doctrine\ORM\EntityManager
     */
    private $em;

    /**
     * @var \Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler
     */
    private $configHandler;

    /**
     * @DI\InjectParams({
     *      "em"            = @DI\Inject("claroline.persistence.object_manager"),
     *      "ed"            = @DI\Inject("event_dispatcher"),
     *      "configHandler" = @DI\Inject("claroline.config.platform_config_handler"),
     * })
     */
    public function __construct(
        ObjectManager $em,
        EventDispatcherInterface $ed,
        PlatformConfigurationHandler $configHandler
    ) {
        $this->em = $em;
        $this->ed = $ed;
        $this->configHandler = $configHandler;
        $this->notificationParametersRepository = $em
            ->getRepository('IcapNotificationBundle:NotificationParameters');
    }

    public function getParametersByUserId($userId)
    {
        $parameters = null;
        try {
            $parameters = $this->notificationParametersRepository->findParametersByUserId($userId);
        } catch (NoResultException $nre) {
            $this->em->startFlushSuite();
            $parameters = $this->createEmptyParameters();
            $parameters->setUserId($userId);
            $this->em->persist($parameters);
            $this->em->endFlushSuite();
        }

        return $parameters;
    }

    public function getAdminParameters()
    {
        $parameters = new NotificationParameters();
        $parameters->setDisplayEnabledTypes($this->configHandler->getParameter('notification_display_enabled_types'));
        $parameters->setPhoneEnabledTypes($this->configHandler->getParameter('notification_phone_enabled_types'));
        $parameters->setMailEnabledTypes($this->configHandler->getParameter('notification_mail_enabled_types'));
        $parameters->setRssEnabledTypes($this->configHandler->getParameter('notification_rss_enabled_types'));

        return $parameters;
    }

    public function getParametersByRssId($rssId)
    {
        return $this->notificationParametersRepository->findOneByRssId($rssId);
    }

    public function regenerateRssId($userId)
    {
        $parameters = $this->getParametersByUserId($userId);
        if (!$parameters->isNew()) {
            $parameters->setRssId($this->uniqueRssId());
            $this->em->persist($parameters);
            $this->em->flush();
        }

        return $parameters;
    }

    /**
     * Il faudra comparer avec les paramèters de l'admin ici.
     */
    public function allTypesList(NotificationParameters $parameters)
    {
        $allTypes = [];

        $this->ed->dispatch(
            'icap_notification_parameters_event',
            new NotificationParametersEvent($allTypes)
        );

        $displayEnabledTypes = $parameters->getDisplayEnabledTypes();
        $rssEnabledTypes = $parameters->getRssEnabledTypes();
        $phoneEnabledTypes = $parameters->getPhoneEnabledTypes();
        $mailEnabledTypes = $parameters->getMailEnabledTypes();

        foreach ($allTypes as $key => $type) {
            $allTypes[$key]['display'] = (isset($displayEnabledTypes[$type['name']])) ? $displayEnabledTypes[$type['name']] : true;
            $allTypes[$key]['rss'] = (isset($rssEnabledTypes[$type['name']])) ? $rssEnabledTypes[$type['name']] : false;
            $allTypes[$key]['phone'] = (isset($phoneEnabledTypes[$type['name']])) ? $phoneEnabledTypes[$type['name']] : false;
            $allTypes[$key]['mail'] = (isset($mailEnabledTypes[$type['name']])) ? $mailEnabledTypes[$type['name']] : false;
        }

        return $allTypes;
    }

    /**
     * Keep in mind that we need to check the admin parameters before.
     */
    public function editUserParameters(array $newDisplay, array $newRss, array $newPhone, array $newMail, $userId = null)
    {
        $userParameters = $this->getParametersByUserId($userId);
        $userParameters->setDisplayEnabledTypes($newDisplay);
        $userParameters->setPhoneEnabledTypes($newPhone);
        $userParameters->setMailEnabledTypes($newMail);
        $userParameters->setRssEnabledTypes($newRss);

        $this->em->persist($userParameters);
        $this->em->flush();

        return $userParameters;
    }

    public function editAdminParameters(array $newDisplay, array $newRss, array $newPhone, array $newMail)
    {
        $this->configHandler->setParameter('notification_display_enabled_types', $newDisplay);
        $this->configHandler->setParameter('notification_phone_enabled_types', $newPhone);
        $this->configHandler->setParameter('notification_mail_enabled_types', $newMail);
        $this->configHandler->setParameter('notification_rss_enabled_types', $newRss);

        return $this->getAdminParameters();
    }

    public function editLockParameters(array $newDisplay, array $newRss, array $newPhone, array $newMail)
    {
        $this->configHandler->setParameter('notification_locked_display_enabled_types', $newDisplay);
        $this->configHandler->setParameter('notification_locked_phone_enabled_types', $newPhone);
        $this->configHandler->setParameter('notification_locked_mail_enabled_types', $newMail);
        $this->configHandler->setParameter('notification_locked_rss_enabled_types', $newRss);
    }

    private function createEmptyParameters()
    {
        $parameters = new NotificationParameters();
        $parameters->setRssId($this->uniqueRssId());
        $parameters->setType(NotificationParameters::TYPE_USER);
        $this->em->persist($parameters);
        $this->em->flush();

        return $parameters;
    }

    private function uniqueRssId()
    {
        return md5(uniqid());
    }
}
