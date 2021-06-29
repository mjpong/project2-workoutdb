import React from "react";
import axios from "axios";

const baseURL = "https://3000-amethyst-lungfish-54xn6kl3.ws-us08.gitpod.io"


export default class BrowseWorkout extends React.Component {

    state = {
        'all_workout': [],
        'all_musclegroup': [],
        'all_duration': [],
        'all_focus': [],
        'search_field': [],
        'workoutshowing': false,
        'muscleshowing': false,

        // search
        'search_field': "",
        'difficulty_filter': "",
        'duration_filter': ''
    }

    async componentDidMount() {
        this.getAllWorkouts()
    }

    getAllWorkouts = async () => {
        let r = await axios.get(baseURL + "/workouts/browse")

        this.setState({
            'all_workout': r.data,
            'all_musclegroup': r.data.muscle_group,
            'all_duration': r.data.duration,
            'all_focus': r.data.focus
        })
    }

    updateForm = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    renderAllWorkouts = () => {
        let list = []
        for (let l of this.state.all_workout) {
            list.push(
                <div className="" key={l._id} onClick={() => this.props.viewWorkout(l._id)}>
                    <div className="container workout-card">
                        <p><strong>{l.name} </strong></p>
                        <p className="workout-text"
                            style={{ textTransform: 'capitalize' }}>
                            {l.duration} mins • {l.difficulty} Level • {l.intensity} Intensity
                            </p>
                    </div>
                </div>
            )
        }
        if (list.length === 0) {
            list.push(
                <div>No Results Found</div>
            )
        }
        return list
    }

    filterFocus = async (f) => {
        let response = await axios.get(baseURL + '/workouts/filter/workoutfocus' + "?q=" + f)
        this.setState({
            all_workout: response.data.reverse()
        })
    }

    filterMuscle = async (m) => {
        let response = await axios.get(baseURL + '/workouts/filter/musclegroup' + "?q=" + m)
        this.setState({
            all_workout: response.data.reverse()
        })
    }

    searchQuery = async () => {
        let searchQuery = ""

        if (this.state.search_field !== "") {
            searchQuery += "q=" + this.state.search_field
        }

        if (this.state.duration_filter !== "" && this.state.duration_filter !== "- Duration -") {
            searchQuery += "&duration=" + this.state.duration_filter
        }

        if (this.state.difficulty_filter !== "" && this.state.difficulty_filter !== "- Difficulty Level -") {
            searchQuery += "&difficulty=" + this.state.difficulty_filter
        }

        let response = await axios.get(baseURL + "/workouts/search" + "?" + searchQuery)

        this.setState({
            all_workout: response.data.reverse()
        })
    }

    resetQuery = async () => {

        this.getAllWorkouts();
        this.setState({
            'search_field': ""
        })

    }

    render() {

        const { muscleshowing } = this.state;
        const { workoutshowing } = this.state;

        return (
            <React.Fragment>
                <div className="container">
                    <div className="header-wrapper row">
                        <img className="header-image" src={require('./images/header-image.png').default} alt="header" />
                    </div>

                    <div className="muscle-wrapper row" align="center">

                        <div className="muscle-group-pic col-6">
                            <img className="banner-image" src={require('./images/workout1.png').default} alt="workout1" />
                        </div>
                        <div className="muscle-group col-6">
                            <button className="btn btn-default" onClick={() => this.setState({ muscleshowing: !muscleshowing })}>
                                <h3> MUSCLE GROUP </h3>
                            </button>
                            {muscleshowing ?
                                <div className="subcategory">
                                    <ul>
                                        <li onClick={() => this.filterMuscle("Abdominals,Chest")}>Abs and Chest</li>
                                        <li onClick={() => this.filterMuscle("Arms,Shoulders")}>Arms and Shoulders</li>
                                        <li onClick={() => this.filterMuscle("Back,Leg")}>Back and Legs</li>
                                    </ul>
                                </div>
                                : null}
                        </div>
                    </div>

                    <div className="focus-wrapper row" align="center">

                        <div className="workout-focus col-6">
                            <button className="btn btn-default" onClick={() => this.setState({ workoutshowing: !workoutshowing })}>
                                <h3> WORKOUT FOCUS </h3>
                            </button>
                            {workoutshowing ?
                                <div className="subcategory">
                                    <ul>
                                        <li onClick={() => this.filterFocus('endurance')}>Endurance</li>
                                        <li onClick={() => this.filterFocus('strength')}>Strength</li>
                                        <li onClick={() => this.filterFocus('mobility')}>Mobility</li>
                                    </ul>
                                </div>
                                : null}
                        </div>
                        <div className="workout-focus-pic col-6" >
                            <img className="banner-image" src={require('./images/workout3.png').default} alt="workout3" />
                        </div>
                    </div>

                    <div className="results-section p-4">
                        <div className="search-bar-container p-2">
                            <input type="text" name="search_field"
                                className="search-bar form-control my-1 mx-sm-2"
                                value={this.state.search_field}
                                placeholder="Search Workouts"
                                onChange={this.updateForm} />
                            <select className="form-control my-1 mx-sm-2" value={this.state.difficulty_filter} name="difficulty_filter" onChange={this.updateForm}>
                                <option defaultValue> - Difficulty Level - </option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="expert">Expert</option>
                            </select>
                            <select className="form-control my-1 mx-sm-2" value={this.state.duration_filter} name="duration_filter" onChange={this.updateForm}>
                                <option defaultValue> - Duration - </option>
                                <option value="short"> Under 30 minutes </option>
                                <option value="medium"> 30 - 45 minutes </option>
                                <option value="long"> More than 45 minutes  </option>
                            </select>
                            <div className="filter-buttons">
                                <button type="submit" className="btn btn-secondary search my-1 mx-sm-2" onClick={this.searchQuery}><i class="fas fa-search"></i></button>
                                <button type="submit" className="btn btn-secondary search-reset my-1 mx-sm-2" onClick={this.resetQuery}><i class="fas fa-undo-alt"></i></button>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="filter-results">
                            <h5>There are a total of {this.state.all_workout.length} workouts: </h5>
                            {this.renderAllWorkouts()}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}