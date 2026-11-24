
import { useState } from 'react'
import { useAuth } from './lib/useAuth'

// Main pages
import NavigateTo from './pages/NavigateTo'
import SignIn from './pages/SignIn'
import MyProfile from './pages/MyProfile'
import AdminDashboard from './pages/AdminDashboard'
import NotAllowed from './pages/NotAllowed'

// Booking form pages
import GetClientDetails from './pages/form/GetClientDetails'
import GetCarDetails from './pages/form/GetCarDetails'
import SelectPackage from './pages/form/SelectPackage'
import SelectDate from './pages/form/SelectDate'
import ReviewSubmit from './pages/form/ReviewSubmit'
import Confirmation from './pages/form/Confirmation'

// Pages that need someone signed in
const SIGNED_IN_PAGES = ['my_profile']

// Pages only the owner and employees can open (US 14).
// This only hides the page. The database also blocks clients from staff data.
const STAFF_PAGES = ['admin_dashboard']

function App() {
  const [page, setPage] = useState('navigate_to')
  const { user, profile, isStaff, loading } = useAuth()

  // Available pages
  const pages = {
    navigate_to: NavigateTo,
    sign_in: SignIn,
    my_profile: MyProfile,
    admin_dashboard: AdminDashboard,
    not_allowed: NotAllowed,
    form_getclientdetails: GetClientDetails,
    form_getcardetails: GetCarDetails,
    form_selectpackage: SelectPackage,
    form_selectdate: SelectDate,
    form_reviewsubmit: ReviewSubmit,
    form_confirmation: Confirmation
  }

  // Wait until we know who is signed in and their role
  if (loading || (user && !profile)) {
    return <div className="page"><p>Loading...</p></div>
  }

  // Send people to sign in, or block clients from staff pages
  let pageToShow = page
  if (STAFF_PAGES.includes(page) && !isStaff) {
    pageToShow = user ? 'not_allowed' : 'sign_in'
  } else if (SIGNED_IN_PAGES.includes(page) && !user) {
    pageToShow = 'sign_in'
  }

  const CurrentPage = pages[pageToShow]

  return (
    <div>
      <CurrentPage navigate={setPage} />
    </div>
  )
}

export default App
