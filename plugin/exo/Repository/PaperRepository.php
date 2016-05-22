<?php

namespace UJM\ExoBundle\Repository;

use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\EntityRepository;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Hint;
use UJM\ExoBundle\Entity\Paper;

/**
 * PaperRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class PaperRepository extends EntityRepository
{
    /**
     * Returns the unfinished papers of a user for a given exercise, if any.
     *
     * @param User     $user
     * @param Exercise $exercise
     *
     * @return array
     */
    public function findUnfinishedPapers(User $user, Exercise $exercise)
    {
        return $this->createQueryBuilder('p')
            ->join('p.user', 'u')
            ->join('p.exercise', 'e')
            ->where('u = :user')
            ->andWhere('e = :exercise')
            ->andWhere('p.end IS NULL')
            ->orderBy('p.start', 'DESC')
            ->setParameters(['user' => $user, 'exercise' => $exercise])
            ->getQuery()
            ->getResult();
    }

    /**
     * Get the user's papers for an exercise.
     *
     *
     * @param int  $userID     id User
     * @param int  $exerciseID id Exercise
     * @param bool $finished   to return or no the papers no finished
     *
     * Return array[Paper]
     */
    public function getExerciseUserPapers($userID, $exerciseID, $finished = false)
    {
        $qb = $this->createQueryBuilder('p');
        $qb->join('p.user', 'u')
            ->join('p.exercise', 'e')
            ->where($qb->expr()->in('u.id', $userID))
            ->andWhere($qb->expr()->in('e.id', $exerciseID))
            ->orderBy('p.id', 'ASC');

        if ($finished === true) {
            $qb->andWhere('p.end is NOT NULL');
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Get all papers for an exercise.
     *
     *
     * @param int $exerciseID id Exercise
     *
     * Return array[Paper]
     */
    public function getExerciseAllPapers($exerciseID)
    {
        $qb = $this->createQueryBuilder('p');
        $qb->join('p.exercise', 'e')
            ->leftJoin('p.user', 'u')
            ->where($qb->expr()->in('e.id', $exerciseID))
            ->orderBy('u.lastName', 'ASC')
            ->addOrderBy('u.firstName', 'ASC')
            ->addOrderBy('p.id', 'ASC');

        return $qb->getQuery()->getResult();
    }

    /**
     * Returns all papers for an exercise for CSV export.
     *
     *
     * @param int $exerciseID id Exercise
     *
     * Return array[Paper]
     */
    public function getExerciseAllPapersIterator($exerciseID)
    {
        $qb = $this->createQueryBuilder('p');
        $qb->join('p.exercise', 'e')
            ->join('p.user', 'u')
            ->where($qb->expr()->in('e.id', $exerciseID))
            ->orderBy('u.lastName', 'ASC')
            ->addOrderBy('u.firstName', 'ASC')
            ->addOrderBy('p.id', 'ASC');

        return $qb->getQuery()->iterate();
    }

    /**
     * Returns the number of papers for an exercise.
     *
     * @param Exercise $exercise
     *
     * @return int the number of exercise papers
     */
    public function countExercisePapers(Exercise $exercise)
    {
        $qb = $this->createQueryBuilder('p');

        $nbPapers = $qb->select('COUNT(p)')
                       ->join('p.exercise', 'e')
                       ->where('e = :exercise')
                       ->setParameters(['exercise' => $exercise])
                       ->getQuery()
                       ->getSingleScalarResult();

        return $nbPapers;
    }

    /**
     * Count the number of finished paper for a user and an exercise.
     *
     * @param Exercise $exercise
     * @param User     $user
     *
     * @return int the number of finished papers
     */
    public function countUserFinishedPapers(Exercise $exercise, User $user)
    {
        $qb = $this->createQueryBuilder('p');

        $nb = $qb->select('COUNT(p)')
                    ->join('p.exercise', 'e')
                    ->join('p.user', 'u')
                    ->where('u = :user')
                    ->andWhere('e = :exercise')
                    ->andWhere('p.end IS NOT NULL')
                    ->setParameters(['user' => $user, 'exercise' => $exercise])
                    ->getQuery()
                    ->getSingleScalarResult();

        return $nb;
    }

    /**
     * Returns whether a hint is related to a paper.
     *
     * @param Paper $paper
     * @param Hint  $hint
     *
     * @return bool
     */
    public function hasHint(Paper $paper, Hint $hint)
    {
        $qb = $this->createQueryBuilder('p');

        $count = $qb->select('COUNT(p)')
            ->join('p.exercise', 'e')
            ->join('e.steps', 's')
            ->join('s.stepQuestions', 'sq')
            ->where('e = :exercise')
            ->andWhere('sq.question = :question')
            ->setParameters(['question' => $hint->getQuestion(), 'exercise' => $paper->getExercise()])
            ->getQuery()
            ->getSingleScalarResult();

        return 0 < $count;
    }
}
