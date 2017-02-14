<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Library\Model\ScoreTrait;

/**
 * Choice.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_color")
 */
class ColorSelection
{
    use ScoreTrait;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Selection", inversedBy="colorSelections")
     * @ORM\JoinColumn(name="selection_id", referencedColumnName="id")
     */
    private $selection;

    /**
     * @ORM\ManyToOne(targetEntity="Color", inversedBy="colorSelections")
     * @ORM\JoinColumn(name="selection_id", referencedColumnName="id")
     */
    private $color;

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

    public function setColor(Color $color)
    {
        $this->color = $color;
    }

    public function getColor()
    {
        return $this->color;
    }
}
