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

namespace Icap\NotificationBundle\Entity;

use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="Icap\NotificationBundle\Repository\NotificationParametersRepository")
 * @ORM\Table(name="icap__notification_user_parameters")
 */
class NotificationParameters implements \JsonSerializable
{
    const TYPE_ADMIN = 0;
    const TYPE_USER = 1;
    const TYPE_WORKSPACE = 2;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="integer")
     */
    protected $type;

    /**
     * @ORM\Column(type="integer", name="user_id", nullable=true)
     */
    protected $userId;

    /**
     * @var ArrayCollection
     *
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\Workspace\Workspace",
     *     cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="workspace_id", onDelete="CASCADE", nullable=true)
     */
    protected $workspace;

    /**
     * @ORM\Column(type="array", name="display_enabled_types")
     */
    protected $displayEnabledTypes = [];

    /**
     * @ORM\Column(type="array", name="phone_enabled_types", nullable=true)
     */
    protected $phoneEnabledTypes = [];

    /**
     * @ORM\Column(type="array", name="mail_enabled_types", nullable=true)
     */
    protected $mailEnabledTypes = [];

    /**
     * @ORM\Column(type="array", name="rss_enabled_types")
     */
    protected $rssEnabledTypes = [];

    /**
     * @ORM\Column(type="string", name="rss_id", unique=true)
     */
    protected $rssId;

    /**
     * @var bool
     */
    protected $isNew = false;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    /**
     * @return mixed
     */
    public function getDisplayEnabledTypes()
    {
        return $this->displayEnabledTypes ? $this->displayEnabledTypes : [];
    }

    /**
     * @param mixed $displayEnabledTypes
     */
    public function setDisplayEnabledTypes($displayEnabledTypes)
    {
        $this->displayEnabledTypes = $displayEnabledTypes;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function getType()
    {
        return $this->type;
    }

    /**
     * @return mixed
     */
    public function getPhoneEnabledTypes()
    {
        return $this->phoneEnabledTypes ? $this->phoneEnabledTypes : [];
    }

    /**
     * @param mixed $phoneEnabledTypes
     */
    public function setPhoneEnabledTypes($phoneEnabledTypes)
    {
        $this->phoneEnabledTypes = $phoneEnabledTypes;
    }

    /**
     * @return mixed
     */
    public function getMailEnabledTypes()
    {
        return $this->mailEnabledTypes ? $this->mailEnabledTypes : [];
    }

    /**
     * @param mixed $mailEnabledTypes
     */
    public function setMailEnabledTypes($mailEnabledTypes)
    {
        $this->mailEnabledTypes = $mailEnabledTypes;
    }

    /**
     * @return mixed
     */
    public function getRssEnabledTypes()
    {
        return $this->rssEnabledTypes ? $this->rssEnabledTypes : [];
    }

    /**
     * @param mixed $rssEnabledTypes
     */
    public function setRssEnabledTypes($rssEnabledTypes)
    {
        $this->rssEnabledTypes = $rssEnabledTypes;
    }

    /**
     * @return mixed
     */
    public function getRssId()
    {
        return $this->rssId;
    }

    /**
     * @param mixed $rssId
     */
    public function setRssId($rssId)
    {
        $this->rssId = $rssId;
    }

    /**
     * @return bool
     */
    public function isNew()
    {
        return $this->isNew;
    }

    /**
     * @param bool $isNew
     */
    public function setIsNew($isNew)
    {
        $this->isNew = $isNew;
    }

    public function setWorkspace(Workspace $workspace)
    {
        $this->workspace = $workspace;
    }

    public function getWorkspace()
    {
        return $this->workspace;
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'userId' => $this->userId,
            'rssId' => $this->rssId,
            'displayEnabledTypes' => $this->displayEnabledTypes,
            'phoneEnabledTypes' => $this->phoneEnabledTypes,
            'mailEnabledTypes' => $this->mailEnabledTypes,
            'rssEnabledTypes' => $this->rssEnabledTypes,
        ];
    }
}
