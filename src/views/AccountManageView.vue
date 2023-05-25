<script lang="ts">
import type { IAccount} from '@/types/IAccount';
import type { AxiosError, AxiosStatic } from 'axios';
import { onMounted, ref, reactive } from 'vue';
import {defineComponent, inject} from 'vue'
import * as labs from "vuetify/labs/VDataTable";

import { confirmation, alert, success } from "@/components/sweetalert/sweetalert";
import { Authtiems, type IAuthLevel } from '@/types/IAuthlevel';
import AccountRegisterComponent from '@/components/AccountRegisterComponent.vue';

export default defineComponent({
    components:{...labs, AccountRegisterComponent},
    emits:[],
    setup(){
        const axios = inject<AxiosStatic>('$axios')
        const accounts = ref<IAccount[]>([]);
        const authlevelItems = ref<IAuthLevel[]>(Authtiems);
        const itemsPerPage:number = 50
        const currentPage = ref<number>(1);
        const isOpenRegisterdialog = ref<boolean>(false);
        const selItem = ref<IAccount|undefined>(undefined);

        const headers:any =
        [
            {title: 'Item', sortable: false, align: 'start', key:'number'},
            {title: 'Username', sortable: false, key: 'Username'},
            {title: 'Employee name', sortable: false, key: 'Name'},
            {title: 'Employee Id', sortable: false, key: 'EmployeeNo'},
            {title: 'Department', sortable: false, key: 'Department'},
            {title: 'Section', sortable: false, key: 'SectionCode'},
            {title: 'Nicenet', sortable: false, key: 'NiceNet'},
            { title: 'Actions', key: 'actions', sortable: false },
        ]

        onMounted(async()=>{
            var res = await fnFetchdata();
            accounts.value = res;
        })

        const fnClickEdit = (item:IAccount)=>{
            selItem.value = item
            isOpenRegisterdialog.value = true;
        }

        const fnClickDelete = async(item: IAccount,index:number)=>{
            const dialogres = await confirmation('Confirmation' ,'Do you want to cancle this registration?')
            if(dialogres.isconfirm){
                const querystring = `/Authen/deleteaccount?username=${item.username}`
                var res = await axios?.delete<any, any>(querystring, undefined)
                .catch((error:AxiosError)=>{
                    alert('Error', error.response?.data as string);
                });

                if(res?.status == 200)
                {
                    accounts.value.splice(index, 1);
                    success('Complete', 'Remove success');
                }
            }
        }

        const fnFetchdata = async():Promise<IAccount[]> => {
            const res:any = await axios?.get<any, any>(`/Authen/getallaccounts`).catch((error)=>{
                alert('Fail', `Code : ${res.status} Message : ${res.data}`)
            })

            if(res.status == 200)
            {
                return res.data as IAccount[];
            }
            return []
        }

        const fnDialogCreateAccountClose = ()=>{
          isOpenRegisterdialog.value = false;
        }

        const fnOncomplete = (item:IAccount)=>{
            let index = accounts.value.findIndex(x=>x.username == item.username)
            accounts.value[index] = {...item}
        }



        return{
            accounts,
            itemsPerPage,
            currentPage,
            headers,
            fnClickEdit,
            fnClickDelete,
            fnOncomplete,
            authlevelItems,
            isOpenRegisterdialog,
            fnDialogCreateAccountClose,
            selItem
        }
    }
})
</script>

<template>
    <div class="container">
        <v-dialog persistent v-model="isOpenRegisterdialog" max-width="800px" min-width="100px">
            <account-register-component @on-close="fnDialogCreateAccountClose" :data="selItem" mode="edit" @on-compete="fnOncomplete"/>
        </v-dialog>

        <v-data-table
            v-model:items-per-page="itemsPerPage"
            v-model:page="currentPage"
            class="elevation-1"
            :items="accounts"
            :headers="headers">
            <template v-slot:top>
                <v-card style="margin: 5px 5px;">
                    <div style="background-color: rgb(var(--v-theme-primary)); height: 55px; display: flex; justify-content: center; align-items: center;">
                        <strong style="color: rgb(var(--v-theme-textSecondary));">Account Management</strong>
                    </div>
                </v-card>
            </template>

            <template v-slot:item.number="{index}">
                {{((currentPage-1)*itemsPerPage)+index+1}}
            </template>

            <template v-slot:item.Username="{item}">
                {{item.raw.username}}
            </template>

            <template v-slot:item.Name="{item}">
                {{item.raw.name}}
            </template>

            <template v-slot:item.EmployeeNo="{item}">
                {{item.raw.employeeNo}}
            </template>

            <template v-slot:item.Department="{item}">
                {{item.raw.department}}
            </template>

            <template v-slot:item.SectionCode="{item}">
                {{item.raw.sectionCode}}
            </template>

            <template v-slot:item.NiceNet="{item}">
                {{item.raw.niceNet}}
            </template>

            <template v-slot:item.actions="{ item, index }">
                <div style="display: flex; align-items: center;">
                    <v-icon
                        icon="edit"
                        size="small"
                        color="orange"
                        @click="fnClickEdit(item.raw)"
                    >
                    </v-icon>

                    <v-divider v-if="item.raw.state != 3" vertical class="ml-2 mr-2"></v-divider>
                    <v-icon
                        icon="delete"
                        size="small"
                        color="red"
                        @click="fnClickDelete(item.raw, index)"
                    >
                    </v-icon>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: stretch;
        width: 100vw;
        height: 100%;
    }

    div strong{
        text-align: center;
        color: white;
        font-size: 24px;
    }
</style>