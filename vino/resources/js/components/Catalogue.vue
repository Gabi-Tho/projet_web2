<template>

  <header class="site-header">
    <!-- Barre de recherche -->
    <form class="search" action="#" method="GET" @submit.prevent="selectProduct">
        <input type="search" v-model="searchTerm" autocomplete="off" list="catalogue-names" placeholder="rechercher un vin">
        <!-- Bouton de recherche -->
        <button type="submit" @click="clearSearch">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
            <path d="M19.3,5.7l-0.7-0.7L12,11.3L5.4,4.7L4.7,5.4L11.3,12L4.7,18.6l0.7,0.7L12,12.7l6.6,6.6l0.7-0.7L12.7,12L19.3,5.7z"/>
          </svg>
        </button>
    </form>
  </header>

  <div class="liste-container">

    <!-- Liste déroulante -->
    <datalist  id="catalogue-names">
      <option v-for="bouteille in filteredCatalogue.slice(0, 6)" :value="bouteille.nom">{{ bouteille.nom }}</option>
    </datalist>

    <section>
      <!-- Carte de produit sélectionné -->
      <article v-if="selectedProduct" class="catalogue__card">
        <div class="catalogue__card-body">
          <img :src="selectedProduct.image" alt="img-bouteille">
          <div class="catalogue__card-info">

            <div class="card-info-title">
              <h3 class="card-title">{{ selectedProduct.nom }}</h3>
              <p class="card-subtitle">{{ selectedProduct.description }} {{ selectedProduct.format }}</p>
              <p class="card-subtitle">{{ selectedProduct.pays }}</p>
            </div>

            <div class="card-info-client">
              <p class="catalogue__card-count">{{ selectedProduct.prix_saq }}$</p>
            </div>

          </div>

        </div>

        <form @submit.prevent="storeBouteille(bouteille)" class="catalogue-form" >

          <!-- Menu déroulant pour choisir le cellier -->

            <label for="selectField" class="">Choisir Cellier</label>
            <select v-model="bouteille.vino__cellier_id" name="vino__cellier_id" id="selectField" class="">
              <option value="" disabled>--Choisissez un cellier--</option>
              <option  v-for="cellier in mesCellier" :value="cellier.id" >{{ cellier.nom }}</option>
            </select>

            <!-- Champ de quantité -->
            <label for="quantityField">Quantite</label>
            <input v-model="bouteille.quantite" name="quantite" type="number" id="quantityField" class="input" min="1" max="100">


          <!-- Case à cocher pour confirmer l'ajout -->
          <section class="container-confirmation">
            <label for="ajouter" class="">Confirmation</label>
            <input v-model="bouteille.vino__bouteille_id" type="radio" name="vino__bouteille_id" :value="selectedProduct.id" id="ajouter" class="input">
          </section>

          <button type="submit" class="btn">Ajouter</button>

        </form>

      </article>

    </section>

  </div>
    
    <!-- Section pour ajouter nouvelle bouteille -->
    <section   v-show="!selectedProduct">
    
          <h2 class="catalogue_titre-section">Ajouter votre vin</h2>

          <form @submit.prevent='storeCatalogue(catalogue)'>

            <label class="text-form">Nom:</label>
            <input v-model="catalogue.nom" id="catalogue-nom" type="text" class="name">
            <div class="text-red">
                <div v-for="message in validationErrors?.nom">{{ message }}</div>
            </div>

            <label class="text-form">Image:</label>
            <input v-model="catalogue.image" id="catalogue-image" type="text" class="name">
            <div class="text-red">
                <div v-for="message in validationErrors?.image">{{ message }}</div>
            </div>
          
            <label class="text-form">Pays:</label>
            <input v-model="catalogue.pays" id="catalogue-pays" type="text" class="name">
            <div class="text-red">
                <div v-for="message in validationErrors?.pays">{{ message }}</div>
            </div>      
            <label class="text-form">Description:</label>
            <input v-model="catalogue.description" id="catalogue-description" type="text" class="name">
            <div class="text-red">
                <div v-for="message in validationErrors?.description">{{ message }}</div>
            </div>

            <label class="text-form">Prix:</label>
            <input v-model="catalogue.prix_saq" id="catalogue-prix_saq" type="text" class="name">
            <div class="text-red">
                <div v-for="message in validationErrors?.prix_saq">{{ message }}</div>
            </div>
          
            <label class="text-form">Format:</label>
            <input v-model="catalogue.format" id="catalogue-format" type="text" class="name">
            <div class="text-red">
                <div v-for="message in validationErrors?.format">{{ message }}</div>
            </div>
          
            <button :disabled="isLoading" class="btn-submit">
                <div v-show="isLoading"></div>
                <span v-if="isLoading">Processing...</span>
                <span v-else>Ajouter</span>
            </button>

          </form>
    </section>

</template> 


<script>

  // Import des composables nécessaires
  import useCatalogue from '../composables/catalogue'
  import useCellier from '../composables/cellier'
  import useBouteille from '../composables/bouteille'
  import { onMounted, ref, computed, watch, reactive } from 'vue'
  
  
  export default {
    setup() {
      // Utilisation des composables pour récupérer les données nécessaires
      const { catalogue, getCatalogue, deleteCatalogue, isLoading, validationErrors } = useCatalogue()
      const { mesCellier, getCelliers } = useCellier()
      const { storeBouteille } = useBouteille()
      // Référence aux termes de recherche et produit sélectionné
      const searchTerm = ref('')
      const selectedProduct = ref(null)
      // Appel à la fonction de récupération de catalogue et de celliers après la création de la vue
      onMounted(getCatalogue)
      onMounted(getCelliers)
  
      // Création d'un tableau filtré en fonction du terme de recherche
      const filteredCatalogue = computed(() => {
        if (searchTerm.value.length < 2) {
          return []
        }
        return catalogue.value.filter(bouteille => {
          return bouteille.nom.toLowerCase().includes(searchTerm.value.toLowerCase())
        })
      })
      
      // Sélection du produit s'il n'y a pas de produit sélectionné et un terme de recherche existe
      const selectProduct = () => {
        if (searchTerm.value !== '' && selectedProduct.value === null) {
          selectedProduct.value = filteredCatalogue.value[0]
        }
      }

      
      // Réinitialisation des termes de recherche et du produit sélectionné 
      const clearSearch = () => {
      searchTerm.value = ''
      selectedProduct.value = null
      }

      // Observer les changements dans les termes de recherche et sélectionner le premier produit dans la liste filtrée
      watch(searchTerm, () => {
        if (filteredCatalogue.value.length > 0) {
          selectedProduct.value = filteredCatalogue.value[0]
        } else {
          selectedProduct.value = null
        }
      })


      // Définition d'un objet réactif pour stocker les données de bouteille
      const bouteille = reactive ({
        vino__bouteille_id: '',
        vino__cellier_id: '',
        quantite: '',
      })
      
      // Retour des variables et fonctions nécessaires au composant parent
      return {
        catalogue,
        searchTerm,
        filteredCatalogue,
        selectedProduct,
        bouteille,
        mesCellier,
        getCatalogue,
        deleteCatalogue,
        selectProduct,
        storeBouteille,
        watch,
        clearSearch,
        getCelliers,
        isLoading,
        validationErrors
      }
    }
  }
</script>  
   
    
   