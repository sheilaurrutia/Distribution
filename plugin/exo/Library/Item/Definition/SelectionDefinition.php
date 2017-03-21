<?php

namespace UJM\ExoBundle\Library\Item\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;
use UJM\ExoBundle\Entity\Misc\Selection;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Item\ItemType;
use UJM\ExoBundle\Serializer\Item\Type\SelectionQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\SelectionAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Item\Type\SelectionQuestionValidator;

/**
 * Selection question definition.
 *
 * @DI\Service("ujm_exo.definition.question_selection")
 * @DI\Tag("ujm_exo.definition.item")
 */
class SelectionDefinition extends AbstractDefinition
{
    /**
     * @var SelectionQuestionValidator
     */
    private $validator;

    /**
     * @var SelectionAnswerValidator
     */
    private $answerValidator;

    /**
     * @var SelectionQuestionSerializer
     */
    private $serializer;

    /**
     * SelectionDefinition constructor.
     *
     * @param SelectionQuestionValidator  $validator
     * @param SelectionAnswerValidator    $answerValidator
     * @param SelectionQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.question_selection"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_selection"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.question_selection")
     * })
     */
    public function __construct(
        SelectionQuestionValidator $validator,
        SelectionAnswerValidator $answerValidator,
        SelectionQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the selection question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return ItemType::SELECTION;
    }

    /**
     * Gets the selection question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\ItemType\SelectionQuestion';
    }

    /**
     * Gets the selection question validator.
     *
     * @return SelectionQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the selection answer validator.
     *
     * @return SelectionAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the selection question serializer.
     *
     * @return SelectionQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * @param SelectionQuestion $question
     * @param array             $answer
     *
     * @return CorrectedAnswer
     */
    public function correctAnswer(AbstractItem $question, $answers)
    {
        $corrected = new CorrectedAnswer();

        if (!is_null($answers)) {
            switch ($question->getMode()) {
               case $question::MODE_FIND:
                  $foundUuids = [];

                  foreach ($answers->positions as $position) {
                      foreach ($question->getSelections()->toArray() as $selection) {
                          if ($position >= $selection->getBegin() && $position <= $selection->getEnd()) {
                              if ($selection->getScore() > 0) {
                                  $corrected->addExpected($selection);
                                  $foundUuids[] = $selection->getUuid();
                              } else {
                                  $corrected->addUnexpected($selection);
                              }
                          }
                      }
                  }

                  $bestAnswers = $this->expectAnswer($question);
                  $uuids = array_map(function ($selection) {
                      return $selection->getUuid();
                  }, $bestAnswers);

                  foreach ($uuids as $uuid) {
                      if (!in_array($uuid, $foundUuids)) {
                          $corrected->addMissing($question->getSelection($uuid));
                      }
                  }

                  return $corrected;

               case $question::MODE_SELECT:
                  foreach ($answers as $selectionId) {
                      $selection = $question->getSelection($selectionId);
                      $selection->getScore() > 0 ? $corrected->addExpected($selection) : $corrected->addUnexpected($selection);
                  }

                  $bestAnswers = $this->expectAnswer($question);
                  $uuids = array_map(function ($selection) {
                      return $selection->getUuid();
                  }, $bestAnswers);

                  foreach ($uuids as $uuid) {
                      if (!in_array($uuid, $answers)) {
                          $corrected->addMissing($question->getSelection($uuid));
                      }
                  }

                  return $corrected;
               case $question::MODE_HIGHLIGHT:
                  $foundIds = [];

                  foreach ($answers as $highlightAnswer) {
                      $colorSelection = $question->getColorSelection(['color_uuid' => $highlightAnswer->colorId, 'selection_uuid' => $highlightAnswer->selectionId]);
                      $colorSelection->getScore() > 0 ? $corrected->addExpected($colorSelection) : $corrected->addUnexpected($colorSelection);
                      $foundIds[] = $colorSelection->getId();
                  }

                  $bestAnswers = $this->expectAnswer($question);
                  $ids = array_map(function ($colorSelection) {
                      //id always returns null as of now
                      return $colorSelection->getId();
                  }, $bestAnswers);

                  foreach ($ids as $id) {
                      if (!in_array($id, $foundIds)) {
                          $corrected->addMissing($question->getColorSelection(['id' => $id]));
                      }
                  }

                  return $corrected;
            }
        }
    }

    /**
     * @param SelectionQuestion $question
     *
     * @return array
     */
    public function expectAnswer(AbstractItem $question)
    {
        switch ($question->getMode()) {
           case $question::MODE_FIND:
               $selections = $question->getSelections()->toArray();

               return array_filter($selections, function ($selection) {
                   return $selection->getScore() > 0;
               });
           case $question::MODE_SELECT:
              $selections = $question->getSelections()->toArray();

              return array_filter($selections, function ($selection) {
                  return $selection->getScore() > 0;
              });
           case $question::MODE_HIGHLIGHT:
               return array_map(function (Selection $selection) {
                   $best = null;
                   $bestScore = 0;

                   foreach ($selection->getColorSelections() as $colorSelection) {
                       if ($colorSelection->getScore() > $bestScore) {
                           $bestScore = $colorSelection->getScore();
                           $best = $colorSelection;
                       }
                   }

                   return $best;
               }, $question->getSelections()->toArray());
        }
    }

    /**
     * @param SelectionQuestion $selectionQuestion
     * @param array             $answersData
     *
     * @return array
     */
    public function getStatistics(AbstractItem $selectionQuestion, array $answersData)
    {
    }
}
