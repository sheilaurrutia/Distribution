<?php

namespace Claroline\SubscriptionBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * SubscriptionUser
 *
 * @ORM\Table()
 * @ORM\Entity(name="subscription_user")
 */
class SubscriptionUser
{
    /**
     * @var integer
     *
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Claroline\SubscriptionBundle\Entity\Subscription", mappedBy="id")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $subscriptionId;

    /**
     * @var integer
     *
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\User")
     */
    private $user;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="subscriptionDate", type="datetime")
     */
    private $subscriptionDate;


    /**
     * Set subscriptionId
     *
     * @param integer $subscriptionId
     *
     * @return SubscriptionUser
     */
    public function setSubscriptionId($subscriptionId)
    {
        $this->subscriptionId = $subscriptionId;

        return $this;
    }

    /**
     * Get subscriptionId
     *
     * @return integer
     */
    public function getSubscriptionId()
    {
        return $this->subscriptionId;
    }

    /**
     * Set userId
     *
     * @param integer $userId
     *
     * @return SubscriptionUser
     */
    public function setUserId($user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get userId
     *
     * @return integer
     */
    public function getUserId()
    {
        return $this->user;
    }

    /**
     * Set subscriptionDate
     *
     * @param \DateTime $subscriptionDate
     *
     * @return SubscriptionUser
     */
    public function setSubscriptionDate($subscriptionDate)
    {
        $this->subscriptionDate = $subscriptionDate;

        return $this;
    }

    /**
     * Get subscriptionDate
     *
     * @return \DateTime
     */
    public function getSubscriptionDate()
    {
        return $this->subscriptionDate;
    }
}

