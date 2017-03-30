<?php

namespace Claroline\ClacoFormBundle\Entity;

use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\SerializedName;

/**
 * @ORM\Entity
 * @ORM\Table(
 *     name="claro_clacoformbundle_entry_notification",
 *     uniqueConstraints={
 *         @ORM\UniqueConstraint(
 *             name="clacoform_notification_unique_entry_user",
 *             columns={"entry_id", "user_id"}
 *         )
 *     }
 * )
 */
class EntryNotification
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Groups({"api_claco_form"})
     * @SerializedName("id")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\ClacoFormBundle\Entity\Entry")
     * @ORM\JoinColumn(name="entry_id", onDelete="CASCADE")
     */
    protected $entry;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", onDelete="CASCADE")
     */
    protected $user;

    /**
     * @ORM\Column(type="json_array", nullable=true)
     * @Groups({"api_claco_form"})
     * @SerializedName("details")
     */
    protected $details;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getEntry()
    {
        return $this->entry;
    }

    public function setEntry(Entry $entry)
    {
        $this->entry = $entry;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function setUser(User $user)
    {
        $this->user = $user;
    }

    public function getDetails()
    {
        return $this->details;
    }

    public function setDetails($details)
    {
        $this->details = $details;
    }

    public function getNotifyEdition()
    {
        return !is_null($this->details) && isset($this->details['notify_edition']) ? $this->details['notify_edition'] : false;
    }

    public function setNotifyEdition($notifyEdition)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['notify_edition'] = $notifyEdition;
    }

    public function getNotifyComment()
    {
        return !is_null($this->details) && isset($this->details['notify_comment']) ? $this->details['notify_comment'] : false;
    }

    public function setNotifyComment($notifyComment)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['notify_comment'] = $notifyComment;
    }

    public function getNotifyCategory()
    {
        return !is_null($this->details) && isset($this->details['notify_category']) ? $this->details['notify_category'] : false;
    }

    public function setNotifyCategory($notifyCategory)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['notify_category'] = $notifyCategory;
    }
}
