<?php

namespace Claroline\SubscriptionBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Subscription
 *
 * @ORM\Table()
 * @ORM\Entity(name="subscription")
 */
class Subscription
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=255)
     */
    private $description;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="startDate", type="datetime")
     */
    private $startDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="endDate", type="datetime")
     */
    private $endDate;

    /**
     * @var integer
     *
     * @ORM\Column(name="maxUsers", type="integer")
     */
    private $maxUsers;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var boolean
     *
     * @ORM\Column(name="allowModifications", type="boolean")
     */
    private $allowModifications;

    /**
     * @var boolean
     *
     * @ORM\Column(name="sendNotification", type="boolean")
     */
    private $sendNotification;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="dateNotification", type="datetime")
     */
    private $dateNotification;

    /**
     * @var boolean
     *
     * @ORM\Column(name="displayAfterEnd", type="boolean")
     */
    private $displayAfterEnd;


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Subscription
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set startDate
     *
     * @param \DateTime $startDate
     *
     * @return Subscription
     */
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;

        return $this;
    }

    /**
     * Get startDate
     *
     * @return \DateTime
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * Set endDate
     *
     * @param \DateTime $endDate
     *
     * @return Subscription
     */
    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;

        return $this;
    }

    /**
     * Get endDate
     *
     * @return \DateTime
     */
    public function getEndDate()
    {
        return $this->endDate;
    }

    /**
     * Set maxUsers
     *
     * @param integer $maxUsers
     *
     * @return Subscription
     */
    public function setMaxUsers($maxUsers)
    {
        $this->maxUsers = $maxUsers;

        return $this;
    }

    /**
     * Get maxUsers
     *
     * @return integer
     */
    public function getMaxUsers()
    {
        return $this->maxUsers;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Subscription
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set allowModifications
     *
     * @param boolean $allowModifications
     *
     * @return Subscription
     */
    public function setAllowModifications($allowModifications)
    {
        $this->allowModifications = $allowModifications;

        return $this;
    }

    /**
     * Get allowModifications
     *
     * @return boolean
     */
    public function getAllowModifications()
    {
        return $this->allowModifications;
    }

    /**
     * Set sendNotification
     *
     * @param boolean $sendNotification
     *
     * @return Subscription
     */
    public function setSendNotification($sendNotification)
    {
        $this->sendNotification = $sendNotification;

        return $this;
    }

    /**
     * Get sendNotification
     *
     * @return boolean
     */
    public function getSendNotification()
    {
        return $this->sendNotification;
    }

    /**
     * Set dateNotification
     *
     * @param \DateTime $dateNotification
     *
     * @return Subscription
     */
    public function setDateNotification($dateNotification)
    {
        $this->dateNotification = $dateNotification;

        return $this;
    }

    /**
     * Get dateNotification
     *
     * @return \DateTime
     */
    public function getDateNotification()
    {
        return $this->dateNotification;
    }

    /**
     * Set displayAfterEnd
     *
     * @param boolean $displayAfterEnd
     *
     * @return Subscription
     */
    public function setDisplayAfterEnd($displayAfterEnd)
    {
        $this->displayAfterEnd = $displayAfterEnd;

        return $this;
    }

    /**
     * Get displayAfterEnd
     *
     * @return boolean
     */
    public function getDisplayAfterEnd()
    {
        return $this->displayAfterEnd;
    }
}

