import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { Form, Input } from '../../components/Form'
import { fetchData, postData, deleteData } from '../../utils'
import * as Models from '../../actions/models'
import Geomap from '../Admin/Geomap'

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = !_.isEmpty(source) ? Array.from(source) : [];
    const destClone = !_.isEmpty(destination) ? Array.from(destination) : [];
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    removed['status'] = droppableDestination.droppableId
    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : '',
    padding: grid,
});



@connect((store)=>{
	return {
		models: store.models,
		location: store.location,
	}
})
export default class Index extends React.Component {
	constructor(props){
		super(props)
	}

  	state = {
        pending: [],
        processing: [],
        reviewing: [],
        resolved: [],
    };

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
        pending: 'pending',
        processing: 'processing',
        reviewing: 'reviewing',
        resolved: 'resolved'
    };

    getList = id => this.state[this.id2List[id]];

    onDragEnd = async result => {
    	const { source, destination } = result;


    	console.log('result', result)
	    // dropped outside the list
	    if (!destination) {
	        return;
	    }

	    if (source.droppableId === destination.droppableId) {
	        const items = reorder(
	            this.getList(source.droppableId),
	            source.index,
	            destination.index
	        );




	        let state = { items };


	        if (source.droppableId === 'pending') {
	            state = { pending: items }
	        }
	        if (source.droppableId === 'processing') {
	            state = { processing: items }
	        }
	        if (source.droppableId === 'reviewing') {
	            state = { reviewing: items }
	        }
	        if (source.droppableId === 'resolved') {
	            state = { resolved: items }
	        }

	        this.setState(state)
      		let updateBoard = await postData(`/api/board/update`, { board: { value: JSON.stringify(this.state) } })
	    	if(updateBoard.response === 200){
				await Models.set('board', updateBoard.data, dispatch)
	    	}
	    }
	    else {
	        result = move(
	            this.getList(source.droppableId),
	            this.getList(destination.droppableId),
	            source,
	            destination
	        );

	        await this.setState({
	            [source.droppableId]: result[source.droppableId],
	            [destination.droppableId]: result[destination.droppableId],
	        });

	        let updateBoard = await postData(`/api/board/update`, { board: { value: JSON.stringify(this.state) } })
	    	if(updateBoard.response === 200){
				await Models.set('board', updateBoard.data, dispatch)
	    	}
	    }
	}

	loadOrdersPerMonth = async () => {
		let { props } = this
		let { models, dispatch } = props

		let monthlyOrders = await fetchData(`/api/reports/getOrdersPerMonth`)
		if(monthlyOrders.response === 200) {
			Models.set('monthlyOrders', monthlyOrders.data, dispatch)
		}
	}

	loadBoard = async () => {
		let { props } = this
		let { models, dispatch } = props

		let board = await fetchData(`/api/board`)
		if(board.response === 200) {
			//await Models.set('tickets', tickets.data, dispatch)

			this.setState(board.data)

		}
	}

	viewComments = (e, id) => {
		e.preventDefault()
		this.setState({ viewComments: {
			[id]: 'on'
		}})
	}

	componentDidMount = () => {
		let { props } = this
		let { models } = props

		if(!_.has(models, 'tickets')){
			this.loadBoard()
		}

		if(!_.has(models, 'monthlyOrders')){
			this.loadOrdersPerMonth()
		}
	}

	deleteTicket = async ({ e, id }) => {
		e.preventDefault()
		let { props } = this
		let { location, dispatch} = props

		let model = await deleteData(`/api/ticket/delete/${id}`)
		if(model.response === 200){
			this.loadBoard()
		}

	}

	render() {
		let { props } = this
		let { models } = props

		console.log('test sthis.props', this.state, this.props, _.has(models, 'tickets') && _.find(models['tickets'], { status: 'pending' }))
		return [
			<div className='container'>
					<div className="row">
						<div className='col-6 text-left'>
							<h2>Support</h2>
							<h5 className='text-secondary font-weight-light'>Tickets</h5>
						</div>
						<div className='col-6 text-right'>
							<a href='/admin/support/create' className='btn btn-sm btn-outline-success'>Create Ticket</a>
						</div>
					</div>
			</div>,
			<div className="crud admin-support container-fluid p-5 d-flex flex-column">
				<div className="container px-0 d-flex flex-column h-100">

				

				</div>
			</div>,

		]

	}
}
