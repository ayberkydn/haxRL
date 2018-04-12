from GeneticPlatform import GeneticPlatformAsync
        

platform = GeneticPlatformAsync(5)
for n in range(500):
    platform.progress_gen()