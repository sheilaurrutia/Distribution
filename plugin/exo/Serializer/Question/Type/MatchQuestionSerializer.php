<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Label;
use UJM\ExoBundle\Entity\Misc\Proposal;
use UJM\ExoBundle\Entity\QuestionType\MatchQuestion;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\Content\ContentSerializer;

/**
 * @DI\Service("ujm_exo.serializer.question_match")
 */
class MatchQuestionSerializer implements SerializerInterface
{
    /**
     * @var ContentSerializer
     */
    private $contentSerializer;

    /**
     * MatchQuestionSerializer constructor.
     *
     * @DI\InjectParams({
     *      "contentSerializer" = @DI\Inject("ujm_exo.serializer.content")
     * })
     *
     * @param ContentSerializer $contentSerializer
     */
    public function __construct(ContentSerializer $contentSerializer)
    {
        $this->contentSerializer = $contentSerializer;
    }

    /**
     * Converts a Match question into a JSON-encodable structure.
     *
     * @param MatchQuestion $matchQuestion
     * @param array         $options
     *
     * @return \stdClass
     */
    public function serialize($matchQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        $questionData->random = $matchQuestion->getShuffle();
        $questionData->penalty = $matchQuestion->getPenalty();

        $firstSet = array_map(function (Proposal $proposal) use ($options) {
            $itemData = $this->contentSerializer->serialize($proposal, $options);
            $itemData->id = (string) $proposal->getId();

            return $itemData;
        }, $matchQuestion->getProposals()->toArray());

        $secondSet = array_map(function (Label $label) use ($options) {
            $itemData = $this->contentSerializer->serialize($label, $options);
            $itemData->id = (string) $label->getId();

            return $itemData;
        }, $matchQuestion->getLabels()->toArray());

        if ($matchQuestion->getShuffle() && in_array(Transfer::SHUFFLE_ANSWERS, $options)) {
            shuffle($firstSet);
            shuffle($secondSet);
        }

        $questionData->firstSet = $firstSet;
        $questionData->secondSet = $secondSet;

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $questionData->solutions = $this->serializeSolutions($matchQuestion);
        }

        return $questionData;
    }

    /**
     * Converts raw data into a Match question entity.
     *
     * @param \stdClass     $data
     * @param MatchQuestion $matchQuestion
     * @param array         $options
     *
     * @return MatchQuestion
     */
    public function deserialize($data, $matchQuestion = null, array $options = [])
    {
        if (empty($matchQuestion)) {
            $matchQuestion = new MatchQuestion();
        }

        if (!empty($data->penalty) || 0 === $data->penalty) {
            $matchQuestion->setPenalty($data->penalty);
        }

        if (isset($data->shuffle)) {
            $matchQuestion->setShuffle(true);
        }

        // deserialize answer items
        $this->deserializeLabels($matchQuestion, $data->firstSet, $data->solutions);
        $this->deserializeProposals($matchQuestion, $data->secondSet, $data->solutions);

        return $matchQuestion;
    }

    /**
     * Deserializes Question sets and solutions.
     *
     * @param MatchQuestion $matchQuestion
     * @param array          $firstSets ie labels
     * @param array          $solutions
     */
    private function deserializeLabels(MatchQuestion $matchQuestion, array $firstSets, array $solutions)
    {
        $firstSetEntities = $matchQuestion->getLabels()->toArray();

        // ujm_label (interaction_matching_id, data, score, entity_order, feedback, resourceNode_id)
        // ujm_proposal (interaction_matching_id, data, entity_order, resourceNode_id)
        // ujm_proposal_label (proposal_id, label_id) <- je vois pas dans l'entité où ça se passe ça...

        foreach ($firstSets as $index => $firstSetData) {
            $label = null;
          // Searches for an existing Label entity.
          foreach ($firstSetEntities as $entityIndex => $entityLabel) {
              /** @var Label $entityLabel */
              if ((string) $entityLabel->getId() === $firstSetData->id) {
                  $label = $entityLabel;
                  unset($firstSetEntities[$entityIndex]);
                  break;
              }
          }

            if (null === $label) {
                // Create a new choice
            $label = new Label();
            }

            $label->setOrder($index);

          // Deserialize firstSet content
          $label = $this->contentSerializer->deserialize($firstSetData, $label);

          // Set firstSet score and feedback
          $label->setScore(0);
            foreach ($solutions as $solution) {
                if ($solution->firstId === $firstSetData->id) {
                    $label->setScore($solution->score);
                    if (isset($solution->feedback)) {
                        $label->setFeedback($solution->feedback);
                    }

                    break;
                }
            }

            $matchQuestion->addLabel($label);
        }

        // Remaining labels are no longer in the Question
        foreach ($firstSetEntities as $labelToRemove) {
            $matchQuestion->removeLabel($labelToRemove);
        }
    }


    /**
     * Deserializes Question proposals.
     *
     * @param MatchQuestion $matchQuestion
     * @param array          $secondSets ie proposals
     * @param array          $solutions
     */
    private function deserializeProposals(MatchQuestion $matchQuestion, array $secondSets, array $solutions)
    {
        $secondSetEntities = $matchQuestion->getProposals()->toArray();


        foreach ($secondSets as $index => $secondSetData) {
            $proposal = null;
          // Searches for an existing Proposal entity.
          foreach ($secondSetEntities as $entityIndex => $entityProposal) {
              /** @var Label $entityLabel */
              if ((string) $entityLabel->getId() === $secondSetData->id) {
                  $proposal = $entityProposal;
                  unset($secondSetEntities[$entityIndex]);
                  break;
              }
          }

            if (null === $proposal) {
                // Create a new choice
                $proposal = new Proposal();
            }

            $proposal->setOrder($index);

          // Deserialize proposal content
          $proposal = $this->contentSerializer->deserialize($secondSetData, $proposal);

          // get existing expected labels
          $expectedLabelsEntities = $proposal->getExpectedLabels()->toArray();

          // @TODO BIG ONE HANDLE current solutions Set proposal expected label (join table)


            foreach ($solutions as $solution) {
                if ($solution->secondId === $secondSetData->id) {
                    // @TODO find corresponding label
                    $proposal->addExpectedLabel();
                    if (isset($solution->feedback)) {
                        $label->setFeedback($solution->feedback);
                    }
                    unset($expectedLabelsEntities['quel index ?']);


                    break;
                }
            }



            // Remaining expected labels are no longer in the Question
            foreach ($expectedLabelsEntities as $expectedToRemove) {
                $proposal->removeExpectedLabel($expectedToRemove);
            }

            $matchQuestion->addProposal($proposal);
        }

        // Remaining proposals are no longer in the Question
        foreach ($secondSetEntities as $proposalToRemove) {
            $matchQuestion->removeProposal($proposalToRemove);
        }
    }


    private function serializeSolutions(MatchQuestion $matchQuestion)
    {
        $solutions = [];

        foreach ($matchQuestion->getProposals() as $proposal) {
            /** @var Label $label */
            foreach ($proposal->getExpectedLabels() as $label) {
                $solutionData = new \stdClass();
                $solutionData->firstId = (string) $proposal->getId();
                $solutionData->secondId = (string) $label->getId();
                $solutionData->score = $label->getScore();

                if ($label->getFeedback()) {
                    $solutionData->feedback = $label->getFeedback();
                }

                $solutions[] = $solutionData;
            }
        }

        return $solutions;
    }
}
