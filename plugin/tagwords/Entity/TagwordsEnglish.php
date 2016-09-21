<?php

namespace Icap\TagwordsBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="Icap\TagwordsBundle\Repository\TagwordsRepository")
 * @ORM\Table(name="icap_tagwords_english")
 */
class TagwordsEnglish
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    private $tagwordsEnglish;

    /**
     * @ORM\Column(type="float")
     */
    private $ratio;

    /**
     * @return mixed
     */
    public function getRatio()
    {
        return $this->ratio;
    }

    /**
     * @param mixed $ratio
     */
    public function setRatio($ratio)
    {
        $this->ratio = $ratio;
    }

    /**
     * @return mixed
     */
    public function getTagwordsEnglish()
    {
        return $this->tagwordsEnglish;
    }

    /**
     * @param mixed $tagwordsEnglish
     */
    public function setTagwordsEnglish($tagwordsEnglish)
    {
        $this->tagwordsEnglish = $tagwordsEnglish;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    public function serialize()
    {
        return [
            'id' => $this->id,
            'tagwords' => $this->tagwordsEnglish,
            'ratio' => $this->ratio,
        ];
    }
}
