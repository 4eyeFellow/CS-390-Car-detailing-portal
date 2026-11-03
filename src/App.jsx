
import { useState } from 'react'

// Main pages
import NavigateTo from './pages/NavigateTo'
import SignIn from './pages/SignIn'
import MyProfile from './pages/MyProfile'
import AdminDashboard from './pages/AdminDashboard'

// Booking form pages
import GetClientDetails from './pages/form/GetClientDetails'
import GetCarDetails from './pages/form/GetCarDetails'
import SelectPackage from './pages/form/SelectPackage'
import SelectDate from './pages/form/SelectDate'
import ReviewSubmit from './pages/form/ReviewSubmit'
import Confirmation from './pages/form/Confirmation'

// Supabase imports
import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [page, setPage] = useState('navigate_to')

  // Available pages
  const pages = {
    navigate_to: NavigateTo,
    sign_in: SignIn,
    my_profile: MyProfile,
    admin_dashboard: AdminDashboard,
    form_getclientdetails: GetClientDetails,
    form_getcardetails: GetCarDetails,
    form_selectpackage: SelectPackage,
    form_selectdate: SelectDate,
    form_reviewsubmit: ReviewSubmit,
    form_confirmation: Confirmation
  }

  const CurrentPage = pages[page]

  return (
    <div>
      <CurrentPage navigate={setPage} />
    </div>
  )
}

export default App
