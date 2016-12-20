<?php

namespace Icap\NotificationBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AdministrationController extends Controller
{
    /**
     * @Route(
     *   "/admin/index",
     *   name="claro_admin_notifications"
     * )
     * @Template()
     */
    public function indexAction()
    {
    }
}
