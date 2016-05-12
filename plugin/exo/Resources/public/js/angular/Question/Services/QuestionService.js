/**
 * Question Service
 * @param {ChoiceQuestionService}  ChoiceQuestionService
 * @param {ClozeQuestionService}   ClozeQuestionService
 * @param {GraphicQuestionService} GraphicQuestionService
 * @param {MatchQuestionService}   MatchQuestionService
 * @param {OpenQuestionService}    OpenQuestionService
 * @constructor
 */
var QuestionService = function QuestionService(
    ChoiceQuestionService,
    ClozeQuestionService,
    GraphicQuestionService,
    MatchQuestionService,
    OpenQuestionService
) {
    this.services = {};

    // Inject custom services
    this.services['application/x.choice+json']  = ChoiceQuestionService;
    this.services['application/x.match+json']   = MatchQuestionService;
    this.services['application/x.cloze+json']   = ClozeQuestionService;
    this.services['application/x.short+json']   = OpenQuestionService;
    this.services['application/x.graphic+json'] = GraphicQuestionService;
};

// Set up dependency injection
QuestionService.$inject = [
    'ChoiceQuestionService',
    'ClozeQuestionService',
    'GraphicQuestionService',
    'MatchQuestionService',
    'OpenQuestionService'
];

/**
 * Get the Service that manage the QuestionType
 * @return {AbstractQuestionService}
 */
QuestionService.prototype.getTypeService = function getTypeService(questionType) {
    var service = null;
    if (!this.services[questionType]) {
        console.error('Question Type : try to get a Service for an undefined type `' + questionType + '`.');
    } else {
        service = this.services[questionType];
    }

    return service;
};

// Register service into AngularJS
angular
    .module('Question')
    .service('QuestionService', QuestionService);