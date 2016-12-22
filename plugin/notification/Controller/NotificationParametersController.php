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

namespace Icap\NotificationBundle\Controller;

use Claroline\CoreBundle\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class NotificationParametersController extends Controller
{
    /**
     * @Route("/parameters", name="icap_notification_user_parameters")
     * @Method({"GET"})
     * @Template("IcapNotificationBundle:Parameters:config.html.twig")
     * @ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function getAction(User $user)
    {
        $parametersManager = $this->getParametersManager();
        $parameters = $parametersManager->getParametersByUserId($user->getId());
        $types = $parametersManager->allTypesList($parameters);

        return ['types' => $types, 'rssId' => $parameters->getRssId(), 'parameters' => $parameters];
    }

    /**
     * @Route("/parameters", name="icap_notification_save_user_parameters", options = {"expose"=true})
     * @Method({"POST", "PUT"})
     * @Template("IcapNotificationBundle:Parameters:config.html.twig")
     * @ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function postAction(Request $request, User $user)
    {
        $newDisplay = $request->request->get('display');
        $newPhone = $request->request->get('phone');
        $newMail = $request->request->get('mail');
        $newRss = $request->request->get('rss');

        $response = new JsonResponse();

        if (isset($newDisplay) && isset($newRss)) {
            $this->getParametersManager()->editUserParameters($user->getId(), $newDisplay, $newRss, $newPhone, $newMail);
            $response->setData('Success');
            $response->setStatusCode(200);
        } else {
            $response->setData('No Data available');
            $response->setStatusCode(400);
        }

        return $response;
    }

    /**
     * @Route("/regenerate_rss", name="icap_notification_regenerate_rss_url")
     * @Template("IcapNotificationBundle:Parameters:config.html.twig")
     * @ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function regenerateRssUrlAction(User $user)
    {
        $parametersManager = $this->getParametersManager();
        $parameters = $parametersManager->regenerateRssId($user->getId());
        $types = $parametersManager->allTypesList($parameters);

        return ['types' => $types, 'rssId' => $parameters->getRssId(), 'parameters' => $parameters];
    }

    /**
     * @return \Icap\NotificationBundle\Manager\NotificationParametersManager
     */
    private function getParametersManager()
    {
        return $this->get('icap.notification.manager.notification_user_parameters');
    }
}
