<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Icap\NotificationBundle\Controller\API;

use Claroline\CoreBundle\Entity\User;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Put;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Controller\FOSRestController;
use Icap\NotificationBundle\Manager\NotificationManager;
use Icap\NotificationBundle\Manager\NotificationParametersManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

class NotificationController extends FOSRestController
{
    private $notificationManager;

    /**
     * @DI\InjectParams({
     *     "notificationManager" = @DI\Inject("icap.notification.manager"),
     *     "parametersManager"   = @DI\Inject("icap.notification.manager.notification_parameters"),
     *     "request" = @DI\Inject("request")
     * })
     */
    public function __construct(
        NotificationManager $notificationManager,
        NotificationParametersManager $parametersManager,
        Request $request
    ) {
        $this->notificationManager = $notificationManager;
        $this->parametersManager = $parametersManager;
        $this->request = $request;
    }

    /**
     * @Route("/notifications.{_format}", name="icap_notifications", defaults={"_format":"json"})
     * @View(serializerGroups={"api_notification"})
     * @EXT\ParamConverter("user", converter="current_user")
     */
    public function getNotificationsAction(User $user)
    {
        return $this->notificationManager->getUserNotifications($user->getId());
    }

   /**
    * Mark all notifications as read.
    *
    * @Route("/notifications/read.{_format}", name="icap_notifications_read", defaults={"_format":"json"})
    * @View(serializerGroups={"api_notification"})
    * @EXT\ParamConverter("user", converter="current_user")
    */
   public function getNotificationsReadAction(User $user)
   {
       $this->notificationManager->markAllNotificationsAsViewed($user->getId());

       return $this->notificationManager->getUserNotifications($user->getId());
   }

    /**
     * @Get("/notifications/parameters/user", name="icap_notifications_get_user_parameters", defaults={"_format":"json"})
     * @View(serializerGroups={"api_notification"})
     * @EXT\ParamConverter("user", converter="current_user")
     */
    public function getUserParametersAction(User $user)
    {
        return $this->parametersManager->getParametersByUserId($user->getId());
    }

    /**
     * @Put("/notifications/parameters/user", name="icap_notifications_user_put_parameters", defaults={"_format":"json"})
     * @View(serializerGroups={"api_notification"})
     * @EXT\ParamConverter("user", converter="current_user")
     */
    public function putUserParametersAction(User $user)
    {
        $newDisplay = $this->request->request->get('display');
        $newPhone = $this->request->request->get('phone');
        $newMail = $this->request->request->get('mail');
        $newRss = $this->request->request->get('rss');

        $parameters = $this->parametersManager->editUserParameters(
            $newDisplay,
            $newRss,
            $newPhone,
            $newMail,
            $user->getId()
        );

        return $parameters;
    }

    /**
     * @Put("/notifications/parameters/admin", name="icap_notifications_admin_put_parameters", defaults={"_format":"json"})
     * @View(serializerGroups={"api_notification"})
     */
    public function putAdminParametersAction()
    {
        $newDisplay = $this->request->request->get('display');
        $newPhone = $this->request->request->get('phone');
        $newMail = $this->request->request->get('mail');
        $newRss = $this->request->request->get('rss');

        $parameters = $this->parametersManager->editAdminParameters(
            $newDisplay,
            $newRss,
            $newPhone,
            $newMail
        );

        return $parameters;
    }
}
