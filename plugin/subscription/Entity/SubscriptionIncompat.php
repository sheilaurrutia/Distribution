<?php

namespace Claroline\SubscriptionBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * SubscriptionIncompat
 *
 * @ORM\Table()
 * @ORM\Entity(name="subscription_incompat")
 */
class SubscriptionIncompat
{

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Claroline\SubscriptionBundle\Entity\Subscription", mappedBy="id")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $subscriptionId;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Claroline\SubscriptionBundle\Entity\Subscription", mappedBy="id")
     * @ORM\Column(name="incompatibleSessionId", type="integer")
     */
    private $incompatibleSubscriptionId;

    /**
     * Set sessionId
     *
     * @param integer $subscriptionId
     *
     * @return SubscriptionIncompat
     */
    public function setSubscriptionId($subscriptionId)
    {
        $this->subscriptionId = $subscriptionId;

        return $this;
    }

    /**
     * Get sessionId
     *
     * @return integer
     */
    public function getSubscriptionIdId()
    {
        return $this->subscriptionId;
    }

    /**
     * Set incompatibleSessionId
     *
     * @param integer $incompatibleSubscriptionId
     *
     * @return SubscriptionIncompat
     */
    public function setIncompatibleSessionId($incompatibleSubscriptionId)
    {
        $this->incompatibleSubscriptionId = $incompatibleSubscriptionId;

        return $this;
    }

    /**
     * Get incompatibleSessionId
     *
     * @return integer
     */
    public function getIncompatibleSubscriptionId()
    {
        return $this->incompatibleSubscriptionId;
    }
}

