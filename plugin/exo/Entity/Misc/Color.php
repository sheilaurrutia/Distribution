<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use UJM\ExoBundle\Library\Model\UuidTrait;

/**
 * Choice.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_selection_color")
 */
class Color
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
     * The color code.
     *
     * @var bool
     *
     * @ORM\Column(type="string")
     */
    private $colorCode;

    use UuidTrait;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\ItemType\SelectionQuestion", inversedBy="colors")
     * @ORM\JoinColumn(name="interaction_qcm_id", referencedColumnName="id")
     */
    private $interactionSelection;

    /**
     * @ORM\OneToMany(
     *     targetEntity="UJM\ExoBundle\Entity\Misc\ColorSelection",
     *     mappedBy="color",
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

    public function setColorCode($colorCode)
    {
        $this->colorCode = $colorCode;
    }

    public function getColorCode()
    {
        return $this->colorCode;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return SelectionQuestion
     */
    public function getInteractionSelection()
    {
        return $this->interactionSelection;
    }

    /**
     * @param SelectionQuestion $interactionSelection
     */
    public function setInteractionSelection(ChoiceQuestion $interactionSelection)
    {
        $this->interactionSelection = $interactionSelection;
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
