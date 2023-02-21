import React from 'react'

import {ReactComponent as ModelSubmittedImg} from "../../src/img/ModelSubmittedImg.svg"

//materialUI imports
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';



const ModelSubmittedPage = (props) => {

    return (
        <div>
            <Grid container justify="center" style={{"marginTop":"1rem"}}>
                <Grid item xs={12}>
                    <h1>Awesome job!</h1>
                </Grid>
                <Grid item xs={12}>
                    <h3>You have submitted your model!</h3>
                </Grid>
                <Grid item xs={12} style={{"marginBottom":"1rem"}}>
                    Not satisfied?
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        variant = "contained"
                        color = "primary"
                        name = "name"
                        onClick={() => props.callbackShowCompetitionForm()}
                    >
                        Train a new model!
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <ModelSubmittedImg style={{ width: '25rem', "marginTop":"2rem", "height": "auto"}}/>
                </Grid>
            </Grid>
        </div>
    )
}

export default ModelSubmittedPage;
