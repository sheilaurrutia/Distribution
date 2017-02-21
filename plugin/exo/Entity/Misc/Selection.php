<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use UJM\ExoBundle\Entity\ItemType\SelectionQuestion;
use UJM\ExoBundle\Library\Attempt\AnswerPartInterface;
use UJM\ExoBundle\Library\Model\FeedbackTrait;
use UJM\ExoBundle\Library\Model\ScoreTrait;
use UJM\ExoBundle\Library\Model\UuidTrait;

/**
 * Choice.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_selection")
 */
class Selection implements AnswerPartInterface
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    use UuidTrait;

    use ScoreTrait;

    use FeedbackTrait;

    /**
     * The starting position.
     *
     * @var bool
     *
     * @ORM\Column(type="integer")
     */
    private $begin;

    /**
     * The ending position.
     *
     * @var bool
     *
     * @ORM\Column(type="integer")
     */
    private $end;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\ItemType\SelectionQuestion", inversedBy="selections")
     * @ORM\JoinColumn(name="interaction_qcm_id", referencedColumnName="id")
     */
    private $interactionSelection;

    /**
     * @ORM\OneToMany(
     *     targetEntity="UJM\ExoBundle\Entity\Misc\ColorSelection",
     *     mappedBy="selection",
     *     cascade={"persist", "remove"},
     *     orphanRemoval=true
     * )
     * @ORM\OrderBy({"order" = "ASC"})
     */
    private $colorSelections;

    public function __construct()
    {
        $this->uuid = Uuid::uuid4()->toString();
        $this->colorSelections = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return ChoiceQuestion
     */
    public function getInteractionSelection()
    {
        return $this->interactionSelection;
    }

    /**
     * @param ChoiceQuestion $interactionQCM
     */
    public function setInteractionSelection(SelectionQuestion $interactionSelection)
    {
        $this->interactionSelection = $interactionSelection;
    }

    public function setBegin($begin)
    {
        $this->begin = $begin;
    }

    public function getBegin()
    {
        return $this->start;
    }

    public function setEnd($end)
    {
        $this->end = $end;
    }

    public function getEnd()
    {
        return $this->end;
    }

    /**
     * Gets colors.
     *
     * @return ArrayCollection
     */
    public function getColorSelections()
    {
        return $this->colorSelections;
    }

    /**
     * Adds a color selection.
     *
     * @param ColorSelection $colorSelection
     */
    public function addColor(ColorSelection $colorSelection)
    {
        if (!$this->colorSelections->contains($colorSelection)) {
            $this->colorSelections->add($colorSelection);
            $colorSelection->setInteractionHole($this);
        }
    }

    /**
     * Removes a color selection.
     *
     * @param ColorSelection $colorSelection
     */
    public function removeColor(ColorSelection $colorSelection)
    {
        if ($this->colorSelections->contains($colorSelection)) {
            $this->colorSelections->removeElement($colorSelection);
        }
    }
}
