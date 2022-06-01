<template>
  <v-container>
    <v-tabs v-model="tab">
      <v-tab v-for="item in tabs" :key="item.tab">
        {{ item.tab }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="tab in tabs" :key="tab.tab">
        <DataTable :headers="headers" :title="tab.title" :allow-add="true" @add-new="add" :edit-handler="edit"
          :view-handler="view" :delete-handler="del" :loader="loadData">
        </DataTable>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import DataTable from "@/components/DataTable";
import { schools, principles } from "../../firebase";
import { getDocs, query, where, doc, deleteDoc } from "@firebase/firestore";

export default {
  name: 'Schools',
  components: { DataTable },

  data() {
    return {
      principle_id: null,
      tabb: 0,
      tab: null,
      tabs: [
        {
          tab: 'Activated Schools',
          title: 'Activated Schools',
        },
        {
          tab: 'Deactivated Schools',
          title: 'Deactivated Schools',
        }
      ],
      headers: [
        { text: 'School Name ', value: 'name' },
        { text: 'School Email', value: 'email' },
        { text: 'School City', value: 'city' },
      ],
    }
  },

  methods: {
    async del(item) {
      try {
        const id = item.id
        let q
        if (this.tabb == 0) {
          q = query(principles, where("school_id", "==", id));
        } else {
          q = query(principles, where("school_id", "==", id));
        }
        const snapshot = await getDocs(q);
        // console.log(snapshot)
        const data = []
        snapshot.docs.map((e) => {
          data.push({ id: e.id, ...e.data() })
        })
        // console.log(data[0])
        this.principle_id = data[0].id
        // return data
      } catch (e) {
        console.log(e)
      }

      let schoolsRef = doc(schools, item.id)
      await deleteDoc(schoolsRef)

      let principlesRef = doc(principles, this.principle_id)
      await deleteDoc(principlesRef)
      // console.log(this.principle_id)

    },
    edit(item) {
      this.$router.push('/schoolEdit?id=' + item.id)
    },
    view(item) {
      this.$router.push('/schoolView?id=' + item.id)
    },
    add() {
      this.$router.push('/school')
    },
    async loadData() {
      try {
        let q
        if (this.tab === 0) {
          q = query(schools, where("isActive", "==", true));
        } else {
          q = query(schools, where("isActive", "==", false));
        }
        const snapshot = await getDocs(q);
        console.log(snapshot)
        const data = []
        snapshot.docs.map((e) => {
          data.push({ id: e.id, ...e.data() })
        })
        console.log(data)
        return data
      } catch (e) {
        console.log(e)
      }
    }
  },
}
</script>

<style scoped>
</style>
