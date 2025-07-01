<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div class="space-y-1.5">
          <CardTitle>Proposals</CardTitle>
          <CardDescription>
            A list of proposals fetched from the Directus API. Select one using
            the radio buttons.
          </CardDescription>
        </div>

        <TooltipProvider :delay-duration="100">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                :disabled="isLoading"
                @click="fetchProposals"
              >
                <RefreshCcw class="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh Data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CardHeader>
    <CardContent>
      <!-- 
        The RadioGroup component wraps the entire table to manage the state 
        of all radio buttons as a single group. The v-model is bound to 
        our selectedProposalId state.
      -->
      <RadioGroup v-model="selectedProposalId">
        <Table>
          <TableHeader>
            <TableRow>
              <!-- A new header cell is added for the selector column. -->
              <TableHead class="w-[50px]"></TableHead>
              <TableHead class="w-[15%]">ID</TableHead>
              <TableHead class="w-[35%]">Short Title</TableHead>
              <TableHead class="w-[50%]">Long Title</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <!-- Loading State -->
            <template v-if="isLoading">
              <TableRow v-for="n in 3" :key="n">
                <!-- Add a skeleton cell for the new column -->
                <TableCell><Skeleton class="h-4 w-4 rounded-full" /></TableCell>
                <TableCell><Skeleton class="h-6 w-full" /></TableCell>
                <TableCell><Skeleton class="h-6 w-full" /></TableCell>
                <TableCell><Skeleton class="h-6 w-full" /></TableCell>
              </TableRow>
            </template>

            <!-- Data Display -->
            <template v-else-if="proposals.length > 0">
              <TableRow
                v-for="proposal in proposals"
                :key="proposal.id"
                :data-state="selectedProposalId === proposal.id && 'selected'"
              >
                <!-- 
                  The new selector cell contains a RadioGroupItem. Its value is set to the
                  proposal's ID, which links it to the RadioGroup's v-model.
                -->
                <TableCell>
                  <RadioGroupItem
                    :id="`r-${proposal.id}`"
                    :value="proposal.id"
                  />
                </TableCell>
                <TableCell class="font-medium">{{ proposal.id }}</TableCell>
                <TableCell>{{ proposal.short_title }}</TableCell>
                <TableCell>{{ proposal.long_title }}</TableCell>
              </TableRow>
            </template>

            <!-- Empty State -->
            <template v-else>
              <TableRow>
                <!-- The colspan is increased to 4 to account for the new column. -->
                <TableCell :colspan="4" class="h-24 text-center">
                  No proposals found.
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </RadioGroup>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Import newly required RadioGroup components
import { RefreshCcw } from 'lucide-vue-next';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// --- STATE FOR SELECTION ---
// This ref now serves as the v-model for the RadioGroup.
const selectedProposalId = ref(null);

// The handleRowClick function is no longer needed as v-model handles the state.

// --- DATA FETCHING LOGIC (Unchanged) ---

const proposals = ref([]);
const isLoading = ref(false);
const { $directus } = useNuxtApp();

async function fetchProposals() {
  isLoading.value = true;
  console.log('Fetching proposals...');
  try {
    const data = await $directus.query(`
      query {
        proposals {
          id
          long_title
          short_title
          original_title
        }
      }
    `);
    console.log('Proposals fetched successfully!');
    if (data) {
      proposals.value = data.proposals;
      console.log('Proposals data updated!');
    }
  } catch (error) {
    console.error('An error occurred while fetching proposals:', error);
    proposals.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchProposals();
});
</script>

<style scoped>
/* Scoped styles are generally not needed with shadcn-vue. */
</style>
