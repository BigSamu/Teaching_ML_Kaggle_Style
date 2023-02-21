
import _ from "lodash";

export function getPrivateKey(urlApiCall){
    var stringLength = urlApiCall.length;
    var index = stringLength-2; // Omit first '/' character
    var pk = 0;
    var decimalBase = 1;
    while (urlApiCall[index] !== '/'){
        pk = pk + parseInt(urlApiCall[index])*decimalBase;
        index--;
        decimalBase = decimalBase*10;
    }
    return pk;
}

export function getArrayOfFeatureNames(featuresObjects) {
    var featuresNames = []
    for (var i = 0; i < featuresObjects.length; i++) {
        featuresNames.push(featuresObjects[i]["name"])
    }
    return featuresNames;
}

export function clientsDetailsResultsForCompetitionOne(selectedClients){

    var clientsInCohort = [];
    selectedClients.forEach((client) => {
        let details ={
            pk: client.pk,
            first_name: client.first_name,
            last_name: client.last_name,
            cohort_pk: client.cohort,
            competition: 'competition_1',
            submission_pk: client.final_submission_1.pk,
            competition_model_pk: client.final_submission_1.competition_model.pk,
            model_type: client.final_submission_1.competition_model.model_type,
            features: JSON.parse(client.final_submission_1.competition_model.features),
            number_of_features: JSON.parse(client.final_submission_1.competition_model.features).length,
            training_accuracy: getAccuracy(client.final_submission_1.competition_model.scorings[0].true_positives,
                                            client.final_submission_1.competition_model.scorings[0].false_positives,
                                            client.final_submission_1.competition_model.scorings[0].true_negatives,
                                            client.final_submission_1.competition_model.scorings[0].false_negatives).toFixed(3),
            testing_accuracy: getAccuracy(client.final_submission_1.competition_model.scorings[1].true_positives,
                                            client.final_submission_1.competition_model.scorings[1].false_positives,
                                            client.final_submission_1.competition_model.scorings[1].true_negatives,
                                            client.final_submission_1.competition_model.scorings[1].false_negatives).toFixed(3),
            validation_accuracy: getAccuracy(client.final_submission_1.competition_model.scorings[2].true_positives,
                                            client.final_submission_1.competition_model.scorings[2].false_positives,
                                            client.final_submission_1.competition_model.scorings[2].true_negatives,
                                            client.final_submission_1.competition_model.scorings[2].false_negatives).toFixed(3),   
        }
        clientsInCohort.push(details);
    })

    return clientsInCohort;
}

export function clientsDetailsResultsForCompetitionTwo(selectedClients){
    
    var clientsInCohort = [];
    selectedClients.forEach((client) => {
        let details ={
            pk: client.pk,
            first_name: client.first_name,
            last_name: client.last_name,
            cohort_pk: client.cohort,
            competition: 'competition_2',
            submission_pk: client.final_submission_2.pk,
            competition_model_pk: client.final_submission_2.competition_model.pk,
            model_type: client.final_submission_2.competition_model.model_type,
            features: JSON.parse(client.final_submission_2.competition_model.features),
            number_of_features: JSON.parse(client.final_submission_2.competition_model.features).length,
            training_accuracy: getAccuracy(client.final_submission_2.competition_model.scorings[0].true_positives,
                                            client.final_submission_2.competition_model.scorings[0].false_positives,
                                            client.final_submission_2.competition_model.scorings[0].true_negatives,
                                            client.final_submission_2.competition_model.scorings[0].false_negatives).toFixed(3),
            testing_accuracy: getAccuracy(client.final_submission_2.competition_model.scorings[1].true_positives,
                                            client.final_submission_2.competition_model.scorings[1].false_positives,
                                            client.final_submission_2.competition_model.scorings[1].true_negatives,
                                            client.final_submission_2.competition_model.scorings[1].false_negatives).toFixed(3),
            validation_accuracy: getAccuracy(client.final_submission_2.competition_model.scorings[2].true_positives,
                                            client.final_submission_2.competition_model.scorings[2].false_positives,
                                            client.final_submission_2.competition_model.scorings[2].true_negatives,
                                            client.final_submission_2.competition_model.scorings[2].false_negatives).toFixed(3),   
        }
        clientsInCohort.push(details);
    })

    return clientsInCohort;
}


export function getAccuracy(true_positives, false_positives, true_negatives, false_negatives) {
    return (true_positives + true_negatives)/(true_positives+true_negatives+false_positives+false_negatives);
} 

export function getPrecision(true_positives, false_positives) {
    return (true_positives/(true_positives+false_positives));
} 

export function getRecall(true_positives, false_negatives) {
    return (true_positives/(true_positives+false_negatives));
} 

export function getF1Score(precision, recall) {
    return 2*(precision*recall)/(precision+recall);
} 

