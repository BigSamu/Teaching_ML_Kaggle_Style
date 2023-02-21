import React, {useEffect, useState} from 'react';

//MaterialUI imports
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { Bar } from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    }
  }));

const DecTree = (props) => {
    /*var items = [];
    const [hasLeft, setHasLeft] = useState(false);
    const [hasRight, setHasRight] = useState(false);
    const [hasChildren, setHasChildren] = useState(false);
    const [hasClass, setHasClass] = useState(false);
    const [leftData, setLeftData] = useState({});
    const [rightData, setRightData] = useState({});
    const [dataClass, setDataClass] = useState(0);
    const [feature, setFeature] = useState(0);
    const [threshold, setThreshold] = useState(0);

    const [detailView, setDetailView] = useState(false);

    const treeStyles = useStyles();

    useEffect(() => {
        setHasLeft("left" in props.data)
        setHasRight("right" in props.data);
        setHasChildren(hasLeft || hasRight);
        setHasClass("class" in props.data);
        if ("left" in props.data) {
            setLeftData(props.data.left);
        }
        if ("right" in props.data) {
            setRightData(props.data.right);
        }
        if ("class" in props.data) {
            setDataClass(props.data.class);
        } else{
            setFeature(props.data.feature);
            setThreshold(props.data.threshold);
        }
    }, [props.data]);

    const toggleDetail = function() {
        if (detailView) {
            setDetailView(false);
        } else {
            setDetailView(true);
        }
    };*/

    /*return (
        <Table>
        <TableBody>
        { !detailView && 
        <Paper className={treeStyles.paper} onClick={toggleDetail}>
            {hasClass && <b>{dataClass}</b>}
            {!hasClass && <>[{feature}] vs. {Math.round(threshold)}</>}
        </Paper>
        }
        {detailView && props.orientation===1 &&
        <TableRow onContextMenu={toggleDetail}>
            <TableCell size="small">
            {hasLeft && <DecTree orientation={2} data={leftData} />}
            </TableCell>
        </TableRow> &&
        <TableRow onContextMenu={toggleDetail}>
            <TableCell size="small">
            {hasRight && <DecTree orientation={2} data={rightData} />}
            </TableCell>
        </TableRow>
        }
        {detailView && props.orientation===2 &&
        <TableRow>
        <TableCell onContextMenu={toggleDetail}>
            {hasLeft && <DecTree orientation={1} data={leftData} />}
        </TableCell>
        <TableCell onContextMenu={toggleDetail}>
            {hasRight && <DecTree orientation={1} data={rightData} />}
        </TableCell>
        </TableRow>
        }
        </TableBody>
        </Table>
    );*/
    return (
        <div dangerouslySetInnerHTML={{__html: props.data}}></div>
    );
}
export default DecTree;