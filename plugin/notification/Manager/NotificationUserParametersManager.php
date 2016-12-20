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

use Claroline\CoreBundle\Event\Notification\NotificationUserParametersEvent;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\NoResultException;
use Icap\NotificationBundle\Entity\NotificationUserParameters;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Class NotificationUserParametersManager.
 *
 * @DI\Service("icap.notification.manager.notification_user_parameters")
 */
class NotificationUserParametersManager
{
    /**
     * @var \Icap\NotificationBundle\Repository\NotificationUserParametersRepository
     */
    private $notificationUserParametersRepository;

    /**
     * @var \Symfony\Component\EventDispatcher\EventDispatcherInterface
     */
    private $ed;

    /**
     * @var \Doctrine\ORM\EntityManager
     */
    private $em;

    /**
     * @DI\InjectParams({
     *      "em"    = @DI\Inject("doctrine.orm.entity_manager"),
     *      "ed"    = @DI\Inject("event_dispatcher")
     * })
     */
    public function __construct(EntityManager $em, EventDispatcherInterface $ed)
    {
        $this->em = $em;
        $this->ed = $ed;
        $this->notificationUserParametersRepository = $em
            ->getRepository('IcapNotificationBundle:NotificationUserParameters');
    }

    public function getParametersByUserId($userId)
    {
        $parameters = null;
        try {
            $parameters = $this->notificationUserParametersRepository->findParametersByUserId($userId);
        } catch (NoResultException $nre) {
            $parameters = $this->createEmptyParameters($userId);
        }

        return $parameters;
    }

    public function getParametersByRssId($rssId)
    {
        return $this->notificationUserParametersRepository->findOneByRssId($rssId);
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

    public function allTypesList(NotificationUserParameters $parameters)
    {
        $allTypes = [];

        $this->ed->dispatch(
            'icap_notification_user_parameters_event',
            new NotificationUserParametersEvent($allTypes)
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

    //Function not used anymore
    public function processUpdate($newParameters, $userId)
    {
        $userParameters = $this->getParametersByUserId($userId);
        $allParameterTypes = $this->allTypesList($userParameters);

        $displayEnabledTypes = [];
        $rssEnabledTypes = [];

        $phoneEnabledTypes = [];
        $mailEnabledTypes = [];

        foreach ($allParameterTypes as $type) {
            if (isset($newParameters[$type['name']])) {
                $options = $newParameters[$type['name']];

                $displayEnabledTypes[$type['name']] = in_array('visible', $options);
                $rssEnabledTypes[$type['name']] = in_array('rss', $options);

                $phoneEnabledTypes[$type['name']] = in_array('phone', $options);
                $mailEnabledTypes[$type['name']] = in_array('mail', $options);
            } else {
                $displayEnabledTypes[$type['name']] = $rssEnabledTypes[$type['name']] = $phoneEnabledTypes[$type['name']] = $mailEnabledTypes[$type['name']] = false;
            }
        }
        $userParameters->setDisplayEnabledTypes($displayEnabledTypes);
        $userParameters->setRssEnabledTypes($rssEnabledTypes);
        $userParameters->setPhoneEnabledTypes($phoneEnabledTypes);
        $userParameters->setMailEnabledTypes($mailEnabledTypes);

        $this->em->persist($userParameters);
        $this->em->flush();

        return $userParameters;
    }

    public function editUserParameters($userId, $newDisplay, $newRss, $newPhone, $newMail)
    {
        $userParameters = $this->getParametersByUserId($userId);
        $allParameterTypes = $this->allTypesList($userParameters);

        $displayEnabledTypes = [];
        $rssEnabledTypes = [];
        $phoneEnabledTypes = [];
        $mailEnabledTypes = [];

        foreach ($allParameterTypes as $type) {
            $isDisplayChecked = false;
            $isRssChecked = false;
            $isPhoneChecked = false;
            $isMailChecked = false;

            if (isset($newDisplay[$type['name']])) {
                $isDisplayChecked = $newDisplay[$type['name']];
            }

            if (isset($newRss[$type['name']])) {
                $isRssChecked = $newRss[$type['name']];
            }

            if (isset($newPhone[$type['name']])) {
                $isPhoneChecked = $newPhone[$type['name']];
            }

            if (isset($newMail[$type['name']])) {
                $isMailChecked = $newMail[$type['name']];
            }

            $displayEnabledTypes[$type['name']] = $isDisplayChecked;
            $rssEnabledTypes[$type['name']] = $isRssChecked;
            $phoneEnabledTypes[$type['name']] = $isPhoneChecked;
            $mailEnabledTypes[$type['name']] = $isMailChecked;
        }
        $userParameters->setDisplayEnabledTypes($displayEnabledTypes);
        $userParameters->setPhoneEnabledTypes($phoneEnabledTypes);
        $userParameters->setMailEnabledTypes($mailEnabledTypes);
        $userParameters->setRssEnabledTypes($rssEnabledTypes);
        $this->em->persist($userParameters);
        $this->em->flush();

        return $userParameters;
    }

    private function createEmptyParameters($userId)
    {
        $parameters = new NotificationUserParameters();
        $parameters->setUserId($userId);
        $parameters->setRssId($this->uniqueRssId());
        $parameters->setIsNew(true);
        $this->em->persist($parameters);
        $this->em->flush();

        return $parameters;
    }

    private function uniqueRssId()
    {
        return md5(uniqid());
    }
}
