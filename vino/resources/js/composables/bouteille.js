import { ref, inject, reactive, getCurrentInstance } from 'vue';
import { useRouter} from 'vue-router'
import { onMounted } from "vue";
import useAuth from "../composables/auth";

export default function useBouteille() {
    const router = useRouter();
    let mesBouteilles = ref({});
    const uneBouteille = ref({});
    const validationErrors = ref ({});
    const isLoading = ref(false);
    const { user } = useAuth();
    const swal = inject('$swal');
    const axios = require('axios');
    const { $route } = getCurrentInstance().proxy
    const cellier_id = $route.params.id


    const getMesBouteilles = async () => {
        axios.get('api/bouteille')
        .then(response=>{
            mesBouteilles.value = response.data.data;
            //console.log('Mes Bouteilles');
            console.log(mesBouteilles.value);
        })
    }
    const getUneBouteille = async (id) => {
        axios.get('api/bouteille/' + id )
        .then(response=>{
            uneBouteille.value = response.data.data;
            console.log('une bouteille du cellier');
            console.log(uneBouteille);
        })
    } 

        /**
     * Ajoute une bouteille dans le cellier choisi
     * @param {object} cellier 
     * @returns 
     */
    const storeBouteille = async (bouteille) => { 
        if (isLoading.value) return;

        isLoading.value = true
        validationErrors.value = {}
        console.log('Log de la bouteille dans la fonction storeBouteille', bouteille);
        axios.post('/api/bouteille', bouteille)
        .then(response => {
            router.push({name: 'bouteille.index'})
            swal({
                    icon : 'success',
                    title: 'bouteille Ajouté Avec Succès'
                })
        })
        .catch(error =>{
            if(error.response?.data){
                validationErrors.value = error.response.data.errors
            }
        })
        .finally(() => isLoading.value = false)
    }


    const deleteBouteille = async (id) => { 
        swal({
            title: 'Êtes-vous sûr(e)?',
            text: 'Vous ne pourrez pas annuler cette action !',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimez-le !',
            confirmButtonColor: '#ef4444',
            timer: 20000,
            timerProgressBar: true,
            reverseButtons: true
        })
        .then(result =>{
            if (result.isConfirmed){
                console.log(id);

                axios.delete('/api/bouteille/' + id)
                .then(response => {
                   
                    getMesBouteilles()
                    router.push({name: 'bouteille.index'})
                    swal({
                            icon: 'success',
                            title : 'Suppression Effecté Avec Succès'
                        })
                })
                .catch(error =>{
                    swal({
                        icon: 'error',
                        title : 'Une Erreur Est Arrivée'
                    })
                })
            }

        })

    }

    return {
        mesBouteilles,
        uneBouteille,
        getMesBouteilles,
        getUneBouteille,
        deleteBouteille,
        storeBouteille,
        validationErrors, 
        isLoading,
    }
}

// const updateBouteille = async (mesBouteilles) => { 
//     if(isLoading.value) return;

//     isLoading.value = true
//     validationErrors.value = {}

//     axios.put('/api/bouteille/' + mesBouteilles.id, mesBouteilles)
//     .then(response => {
//         router.push({name: 'bouteille.index'})
//         swal({
//                 icon: 'success',
//                 title : 'Modification Effecté Avec Succès'
//             })
//     })
//     .catch(error =>{
//         if(error.response?.data){
//             validationErrors.value = error.response.data.errors
//         }
//     })
//     .finally(() => isLoading.value = false)
// }
