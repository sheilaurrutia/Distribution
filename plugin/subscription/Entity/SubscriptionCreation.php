<?php

namespace Claroline\SubscriptionBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Claroline\CoreBundle\Entity\User;

/**
 * Claroline\SubscriptionBundle\Entity\SubscriptionCreation.
 *
 * @ORM\Entity()
 * @ORM\Table(name="subscritpion_creation")
 */
class SubscriptionCreation
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\User")
     */
    private $user;

    /**
     * @var Subscription
     *
     * @ORM\ManyToOne(targetEntity="Claroline\SubscriptionBundle\Entity\Subscription")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $subscription;

    /**
     * @var bool
     *
     * @ORM\Column(name="creator", type="boolean")
     */
    private $creator;

    /**
     * @var bool
     *
     * @ORM\Column(name="admin", type="boolean")
     */
    private $admin;

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set User.
     *
     * @param User $user
     */
    public function setUser(User $user)
    {
        $this->user = $user;
    }

    /**
     * Get User.
     *
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set Subscription.
     *
     * @param Subscription $subscription
     */
    public function setSubscription(Subscription $subscription)
    {
        $this->subscription = $subscription;
    }

    /**
     * Get Subscription.
     *
     * @return Subscription
     */
    public function getSubscription()
    {
        return $this->subscription;
    }

    /**
     * Set creator.
     *
     * @param bool $creator
     */
    public function setCreator($creator)
    {
        $this->creator = $creator;
    }

    /**
     * Is creator.
     *
     * @return bool
     */
    public function isCreator()
    {
        return $this->creator;
    }

    /**
     * Set admin.
     *
     * @param bool $admin
     */
    public function setAdmin($admin)
    {
        $this->admin = $admin;
    }

    /**
     * Is admin.
     *
     * @return bool
     */
    public function isAdmin()
    {
        return $this->admin;
    }
}
