<?php


namespace tagwords\Entity\Ressources;


use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="pertinence_fr")
 */
class texte
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
    private $motFr;

    /**
     * @ORM\Column(type="float")
     */
    private $ratio;

    /**
     * @return mixed
     */
    public function getMotFr()
    {
        return $this->motFr;
    }

    /**
     * @param mixed $motFr
     */
    public function setMotFr($motFr)
    {
        $this->motFr = $motFr;
    }

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
    public function getId()
    {
        return $this->id;
    }





    public function serialize() //permet de changer le nom des collones de la requete pour le Lexique
    {
        return array(
            'id' => $this->id,
            'motFr' => $this->motFr,
            'ratio' => $this->ratio
        );
    }
}