<?php

namespace UJM\LtiBundle\Entity;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="UJM\LtiBundle\Repository\LtiResourceRepository")
 * @ORM\Table(name="ujm_lti_resource")
*/

class LtiResource  extends AbstractResource
{

    /**
     * @ORM\ManyToOne(targetEntity="LtiApp")
     * @ORM\JoinColumn(nullable=false)
     */

    private $app;

    /**
     * @param LtiApp $app
     */
    public function setApp($app)
    {
        $this->app = $app;
    }

    /**
     * @return LtiApp
     */
    public function getApp()
    {
        return $this->appS;
    }
}