import axios from 'axios';
import * as config from './config/config'

export default {
    classroom: {
        get_classroom_user: () => axios.get(`${config.API_SERVER}/classroom/user/`)
            .then(res => res.data),
        /*post_classroom_user: user => axios.post(`${config.API_SERVER}/classroom/user/`, user)
            .then(res => res.data),*/
        get_classroom_user_by_id: user_id => axios.get(`${config.API_SERVER}/classroom/user/` + user_id)
            .then(res => res.data),
        get_classroom_participant: () => axios.get(`${config.API_SERVER}/classroom/participant/`)
            .then(res => res.data),
        get_classroom_participant_by_id: participant_id => axios.get(`${config.API_SERVER}/classroom/participant/` + participant_id)
            .then(res => res.data),
        get_classroom_cohort: () => axios.get(`${config.API_SERVER}/classroom/cohort/`)
            .then(res => res.data),
        get_classroom_cohort_by_id: cohort_id => axios.get(`${config.API_SERVER}/classroom/cohort/` + cohort_id)
            .then(res => res.data),
        get_classroom_submission: () => axios.get(`${config.API_SERVER}/classroom/submission/`)
            .then(res => res.data),
        get_classroom_submission_by_id: submission_id => axios.get(`${config.API_SERVER}/classroom/submission/` + submission_id)
            .then(res => res.data),
        get_participants_final_results: () => axios.get(`${config.API_SERVER}/classroom/participant_detail/`)
            .then(res => res.data),
        get_cohorts_final_results: () => axios.get(`${config.API_SERVER}/classroom/cohort_detail/`)
            .then(res => res.data),
    },
    ml_model: {
        get_competition_model: () => axios.get(`${config.API_SERVER}/ml_model/competition_model/`)
            .then(res => res.data),
        get_competition_model_by_id: model_id => axios.get(`${config.API_SERVER}/ml_model/competition_model/` + model_id)
            .then(res => res.data),
        get_scorings: () => axios.get(`${config.API_SERVER}/ml_model/scoring/`)
            .then(res => res.data),
        get_scorings_by_id: scoring_id => axios.get(`${config.API_SERVER}/ml_model/scoring/` + scoring_id)
            .then(res => res.data),
        get_features: () => axios.get(`${config.API_SERVER}/ml_model/feature/`)
            .then(res => res.data),
        get_features_by_id: feature_id => axios.get(`${config.API_SERVER}/ml_model/feature/` + feature_id)
            .then(res => res.data),
        get_dec_tree: () => axios.get(`${config.API_SERVER}/ml_model/dec_tree_node/`)
            .then(res => res.data),
        get_dec_tree_node_by_id: dec_tree_node_id => axios.get(`${config.API_SERVER}/ml_model/dec_tree_node/` + dec_tree_node_id)
            .then(res => res.data),
        get_log_reg_element: () => axios.get(`${config.API_SERVER}/ml_model/log_reg_element/`)
            .then(res => res.data),
        get_log_reg_element_by_id: log_reg_element_id => axios.get(`${config.API_SERVER}/ml_model/log_reg_element/` + log_reg_element_id)
            .then(res => res.data),
        create_submission: (participant_pk, competition_number) => axios.post(`${config.API_SERVER}/ml_model/create_submission/` + participant_pk + `/` + competition_number + `/`)
            .then(res => res.data),
        get_scores_by_submission_and_score_type: (submission_pk, score_type) => axios.post(`${config.API_SERVER}/ml_model/score/` + submission_pk + `/` + score_type + `/`)
            .then(res => res.data),
        get_latest_submission_by_participant_and_competition: (participant_pk, competition_number) => axios.post(`${config.API_SERVER}/ml_model/latest_sub/` + participant_pk + `/` + competition_number + `/`)
            .then(res => res.data),
        
    },
    auth: {
        get_user: () => axios.get(`${config.API_SERVER}/api-auth/user/`)
            .then(res => res.data),
        get_user_by_id: user_id => axios.get(`${config.API_SERVER}/api-auth/user/` + user_id)
            .then(res => res.data),
    }
}
