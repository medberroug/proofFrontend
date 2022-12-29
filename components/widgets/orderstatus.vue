<script>
/**
 * Activity component
 */
import { eoLocale } from "date-fns/locale/fr";
import { format, parseISO } from "date-fns";
export default {
    props: ['status'],
    methods: {
        formateDate(date) {
            let result = format(parseISO(date), "EEEE dd/MM/yyyy hh:mm", {
                locale: eoLocale,
            });
            return result;
        },
    }
};
</script>

<template>
    <div class="col">
        <div class="card">
            <div class="card-body">
                <div class="float-end">
                    <!-- <b-dropdown right toggle-class="p-0" variant="white">
                    <template v-slot:button-content>
                        <span class="text-muted">
                            Recent
                            <i class="mdi mdi-chevron-down ml-1"></i>
                        </span>
                    </template>
                    <a class="dropdown-item" href="#">Recent</a>
                    <a class="dropdown-item" href="#">By Users</a>
                </b-dropdown> -->
                </div>

                <h4 class="card-title mb-4">Status Timeline</h4>

                <ol class="activity-feed mb-0 ps-2" data-simplebar style="max-height: 336px;">
                    <li class="feed-item" v-for="(item, index) in status" :key="index">
                        <p class="text-muted mb-1 font-size-13">
                            {{ formateDate(item.date) }}
                        </p>
                        <p class="mt-0 mb-0">
                        <div class="badge badge-pill bg-soft-dark font-size-12" v-if="item.name == 'draft'">
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="badge badge-pill bg-soft-warning font-size-12" v-if="item.name == 'created'">
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="badge badge-pill bg-soft-primary font-size-12" v-if="item.name == 'validated'">
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="badge badge-pill bg-soft-danger font-size-12" v-if="item.name == 'notValidated'">
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="badge badge-pill bg-soft-success font-size-12" v-if="item.name == 'shipped'">
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="badge badge-pill bg-soft-success font-size-12" v-if="item.name == 'closed'">
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="badge badge-pill bg-soft-danger font-size-12" v-if="item.name == 'cancelled'">
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="badge badge-pill bg-soft-danger font-size-12" v-if="item.name == 'returned'">
                            <span>{{ item.name }}</span>
                        </div>



                        </p>
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>
