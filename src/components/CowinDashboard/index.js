// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class CowinDashboard extends Component {
  state = {
    vaccinationCoverageData: [],
    vaccinatedByGenderData: [],
    vaccinatedByAgeData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCowinApi()
  }

  getCowinApi = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(url)

    if (response.ok === true) {
      const data = await response.json()
      const last7DaysData = data.last_7_days_vaccination
      const updatedLast7DaysData = last7DaysData.map(eachItem => ({
        vaccineDate: eachItem.vaccine_date,
        dose1: eachItem.dose_1,
        dose2: eachItem.dose_2,
      }))
      const byGenderData = data.vaccination_by_gender
      const byAgeData = data.vaccination_by_age
      this.setState({
        vaccinationCoverageData: updatedLast7DaysData,
        vaccinatedByGenderData: byGenderData,
        vaccinatedByAgeData: byAgeData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="loader-bg-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-bg-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
    </div>
  )

  renderSuccessView = () => {
    const {
      vaccinationCoverageData,
      vaccinatedByGenderData,
      vaccinatedByAgeData,
    } = this.state
    return (
      <>
        <div className="vaccine-coverage-container">
          <VaccinationCoverage
            vaccinationCoverageData={vaccinationCoverageData}
          />
        </div>
        <div className="vaccination-by-gender-container">
          <VaccinationByGender
            vaccinatedByGenderData={vaccinatedByGenderData}
          />
        </div>
        <div className="vaccination-by-gender-container">
          <VaccinationByAge vaccinatedByAgeData={vaccinatedByAgeData} />
        </div>
      </>
    )
  }

  renderCowinDashboard = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.loading:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowin-dashboard-bg-container">
        <div className="cowin-dashboard-icon-logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="cowin-dashboard-logo"
          />
          <h1 className="cowin-dashboard-logo-title">Co-WIN</h1>
        </div>
        <h1 className="cowin-main-heading">CoWIN Vaccination in India</h1>
        {this.renderCowinDashboard()}
      </div>
    )
  }
}

export default CowinDashboard
