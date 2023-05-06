import baseUrl from './baseurl'
import RadioController from '../controller/RadioController'
import router from './router'

const controller = new RadioController()

router.get(baseUrl + '/radio/index', controller.getIndexRadios)
// router.get(baseUrl + '/radio/scrap', controller.getMetadata)
router.get(baseUrl + '/radio/:id', controller.getRadioById)
router.get(baseUrl + '/radio/by/place/url', controller.getRadiosByPlaceURL)
router.get(baseUrl + '/radio/by/place/:id', controller.getRadiosByPlace)
router.get(baseUrl + '/radio/by/url', controller.getRadioByUrl)
router.post(baseUrl + '/radio/like/:id', controller.likeRadioById)
router.post(baseUrl + '/radio/nearby', controller.getNearByRadios)
router.post(baseUrl + '/radio/country/nearby', controller.getNearByCountry)
router.get(baseUrl + '/radio/globe/data', controller.getGlobeData) // globe data for 3d Earth
router.get(baseUrl + '/search/radio/place', controller.searchRadioPlace)
// router.get(baseUrl + '/radio/country/countrycode', controller.setupCountryCode)
// router.get(baseUrl + '/radio/country/init', controller.initCountry)
export default router
